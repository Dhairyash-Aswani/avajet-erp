package avajet.erp;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class Main {
    private static final List<WorkOrder> orders = new ArrayList<>();
    private static int nextNumber = 2052;

    static class Handoff {
        String team, action, time, status;
        Handoff(String team, String action, String time, String status) { this.team=team; this.action=action; this.time=time; this.status=status; }
        String json() { return "{\"team\":"+q(team)+",\"action\":"+q(action)+",\"time\":"+q(time)+",\"status\":"+q(status)+"}"; }
    }
    static class WorkOrder {
        String id, aircraft, task, owner, status, priority, lastUpdated, partRequest;
        List<Handoff> handoffs = new ArrayList<>();
        WorkOrder(String id,String aircraft,String task,String owner,String status,String priority,String lastUpdated,String partRequest) {
            this.id=id; this.aircraft=aircraft; this.task=task; this.owner=owner; this.status=status; this.priority=priority; this.lastUpdated=lastUpdated; this.partRequest=partRequest;
        }
        String json() {
            StringBuilder h=new StringBuilder("["); for(int i=0;i<handoffs.size();i++){if(i>0)h.append(',');h.append(handoffs.get(i).json());} h.append(']');
            return "{\"id\":"+q(id)+",\"aircraft\":"+q(aircraft)+",\"task\":"+q(task)+",\"owner\":"+q(owner)+",\"status\":"+q(status)+",\"priority\":"+q(priority)+",\"lastUpdated\":"+q(lastUpdated)+",\"partRequest\":"+q(partRequest)+",\"handoffs\":"+h+"}";
        }
    }

    private static void seed() {
        WorkOrder a=new WorkOrder("WO-2048","VT-AVA","Inspect hydraulic pump","Maintenance","In progress","Routine","Today, 09:42","PR-0317 · Hydraulic pump seal");
        a.handoffs.add(new Handoff("CAMO","Work order created","Today, 08:05","Created"));
        a.handoffs.add(new Handoff("Maintenance","Inspection started","Today, 09:42","In progress"));
        WorkOrder b=new WorkOrder("WO-2051","VT-AVB","Review component log","CAMO","Approval needed","High","Today, 08:15","—");
        b.handoffs.add(new Handoff("CAMO","Component log review requested","Today, 08:15","Approval needed"));
        WorkOrder c=new WorkOrder("WO-2039","VT-AVC","Cabin pressure check","Quality","Waiting","Routine","Yesterday","—");
        c.handoffs.add(new Handoff("Maintenance","Inspection submitted","Yesterday","Waiting"));
        orders.add(a); orders.add(b); orders.add(c);
    }
    private static String q(String value) {
        if(value==null)return "null";
        return "\""+value.replace("\\","\\\\").replace("\"","\\\"").replace("\n","\\n").replace("\r","\\r").replace("\t","\\t")+"\"";
    }
    private static Map<String,String> form(HttpExchange ex) throws IOException {
        String raw=new String(ex.getRequestBody().readAllBytes(),StandardCharsets.UTF_8); Map<String,String> out=new LinkedHashMap<>();
        for(String pair:raw.split("&")){if(pair.isEmpty())continue;String[] kv=pair.split("=",2);out.put(URLDecoder.decode(kv[0],StandardCharsets.UTF_8),kv.length>1?URLDecoder.decode(kv[1],StandardCharsets.UTF_8):"");}
        return out;
    }
    private static void send(HttpExchange ex,int code,String body) throws IOException {
        ex.getResponseHeaders().set("Content-Type","application/json; charset=utf-8");
        ex.getResponseHeaders().set("Access-Control-Allow-Origin","*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods","GET,POST,OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers","Content-Type");
        byte[] bytes=body.getBytes(StandardCharsets.UTF_8); ex.sendResponseHeaders(code,bytes.length); ex.getResponseBody().write(bytes); ex.close();
    }
    private static WorkOrder find(String id){for(WorkOrder o:orders)if(o.id.equals(id))return o;return null;}
    private static String now(){return Instant.now().toString();}
    private static void handle(HttpExchange ex) throws IOException {
        String method=ex.getRequestMethod(); String path=ex.getRequestURI().getPath();
        if(method.equals("OPTIONS")){send(ex,204,"");return;}
        if(path.equals("/api/health")&&method.equals("GET")){send(ex,200,"{\"status\":\"ok\",\"service\":\"avajet-java-api\"}");return;}
        if(path.equals("/api/summary")&&method.equals("GET")){
            long open=orders.stream().filter(o->!o.status.equals("Completed")).count();
            long approvals=orders.stream().filter(o->o.status.toLowerCase().contains("approval")||o.status.toLowerCase().contains("review")).count();
            long parts=orders.stream().filter(o->!o.partRequest.equals("—")).count();
            send(ex,200,"{\"openWorkOrders\":"+open+",\"waitingApprovals\":"+approvals+",\"partsToTrack\":"+parts+",\"updated\":"+q("Live")+"}");return;
        }
        if(path.equals("/api/work-orders")&&method.equals("GET")){StringBuilder b=new StringBuilder("[");for(int i=0;i<orders.size();i++){if(i>0)b.append(',');b.append(orders.get(i).json());}send(ex,200,b.append(']').toString());return;}
        if(path.equals("/api/work-orders")&&method.equals("POST")){
            Map<String,String> f=form(ex);String task=f.getOrDefault("task","").trim();String aircraft=f.getOrDefault("aircraft","").trim();
            if(task.isEmpty()||aircraft.isEmpty()){send(ex,400,"{\"error\":\"Aircraft and task are required.\"}");return;}
            String id="WO-"+(nextNumber++);WorkOrder o=new WorkOrder(id,aircraft,task,f.getOrDefault("owner","CAMO"),"Not started",f.getOrDefault("priority","Routine"),"Just now",f.getOrDefault("partRequest","—"));
            o.handoffs.add(new Handoff("CAMO","Work order created",now(),"Not started"));orders.add(0,o);send(ex,201,o.json());return;
        }
        if(path.startsWith("/api/work-orders/")){
            String tail=path.substring("/api/work-orders/".length());String[] pieces=tail.split("/");WorkOrder o=find(pieces[0]);
            if(o==null){send(ex,404,"{\"error\":\"Work order not found.\"}");return;}
            if(pieces.length==1&&method.equals("GET")){send(ex,200,o.json());return;}
            if(pieces.length==2&&pieces[1].equals("review")&&method.equals("POST")){
                Map<String,String> f=form(ex);String destination=f.getOrDefault("sendTo","CAMO review");String note=f.getOrDefault("note","");String due=f.getOrDefault("dueDate","");
                o.owner=destination;o.status="Awaiting review";o.lastUpdated="Just now";String action="Review request sent";if(!due.isBlank())action+=" · Due "+due;if(!note.isBlank())action+=" · "+note;o.handoffs.add(new Handoff(destination,action,now(),o.status));send(ex,200,o.json());return;
            }
        }
        send(ex,404,"{\"error\":\"Route not found.\"}");
    }
    public static void main(String[] args) throws Exception {
        seed();int port=Integer.getInteger("avajet.port",8081);HttpServer server=HttpServer.create(new InetSocketAddress("127.0.0.1",port),0);server.createContext("/api/",Main::handle);server.setExecutor(Executors.newCachedThreadPool());server.start();System.out.println("AVAJET Java API running at http://localhost:"+port);
    }
}

