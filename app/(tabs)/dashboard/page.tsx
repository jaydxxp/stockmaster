"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function Dashboard() {
  const movementRef = useRef(null);
  const operationsRef = useRef(null);

  useEffect(() => {

    if (movementRef.current) {
      const chart = echarts.init(movementRef.current);

      chart.setOption({
        animationDuration: 1200,
        textStyle: { color: "#000" },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLine: { lineStyle: { color: "#000" } },
        },
        yAxis: {
          type: "value",
          axisLine: { lineStyle: { color: "#000" } },
          splitLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
        },
        series: [
          {
            data: [120, 160, 140, 210, 230, 180, 150],
            type: "line",
            smooth: true,
            symbol: "circle",
            lineStyle: { width: 3 },
          },
        ],
      });
    }

    
    if (operationsRef.current) {
      const chart = echarts.init(operationsRef.current);

      chart.setOption({
        animationDuration: 1200,
        tooltip: { trigger: "item" },
        series: [
          {
            name: "Operations",
            type: "pie",
            radius: "65%",
            data: [
              { value: 124, name: "Receipts" },
              { value: 98, name: "Deliveries" },
            ],
            label: { color: "#000" },
            emphasis: { scale: true },
          },
        ],
      });
    }
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
      <p className="text-gray-600 mb-8">Your warehouse performance at a glance.</p>

   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard title="Total Operations" value="222" />
        <KpiCard title="Stock Movements This Week" value="1,290" />
        <KpiCard title="Pending Deliveries" value="18" />
      </div>

  
      <div className="flex gap-6 border-b border-black/10 pb-4 mb-8">
        <span className="text-black font-medium hover:opacity-60 transition cursor-pointer">
          Overview
        </span>
        <span className="text-gray-500 hover:text-black transition cursor-pointer">
          Movements
        </span>
        <span className="text-gray-500 hover:text-black transition cursor-pointer">
          Stock
        </span>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
     
        <div className="border border-black/10 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-4">Stock Movement</h3>
          <div ref={movementRef} className="w-full h-[300px]"></div>
        </div>

       
        <div className="border border-black/10 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-4">Operations Overview</h3>
          <div ref={operationsRef} className="w-full h-[300px]"></div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard title="Most Active Warehouse" text="Main Warehouse" />
        <InfoCard title="Fastest Growing Product" text="iPhone 15 Pro" />
        <InfoCard title="System Status" text="All Systems Operational" />
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 border border-black/10 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-gray-700 mt-2">{text}</p>
    </div>
  );
}
