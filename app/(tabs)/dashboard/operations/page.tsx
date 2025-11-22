import Link from "next/link"

export default function Operations() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Operations Overview</h2>
      <p className="text-gray-600 mb-10">
        Track receipt and delivery statuses in real-time.
      </p>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <Link href={"/dashboard/operations/receipt"}>
        <div className="
          p-8 border border-black/10 rounded-2xl 
          bg-white hover:shadow-xl hover:border-black/30 
          transition cursor-pointer
        ">
          <h3 className="text-xl font-bold mb-4">Receipt Status</h3>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-red-500">Late</span>
            </p>

            <p className="flex justify-between">
              <span>Expected Shipments:</span>
              <span className="font-semibold">5</span>
            </p>

            <p className="flex justify-between">
              <span>More:</span>
              <span className="font-semibold text-black underline cursor-pointer">View Details</span>
            </p>
          </div>
        </div>
        </Link>

        <Link href={"/dashboard/operations/delivery"}>
        <div className="
          p-8 border border-black/10 rounded-2xl 
          bg-white hover:shadow-xl hover:border-black/30 
          transition cursor-pointer
        ">
          <h3 className="text-xl font-bold mb-4">Delivery Status</h3>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex justify-between">
              <span>To Deliver:</span>
              <span className="font-semibold">4</span>
            </p>

            <p className="flex justify-between">
              <span>Late:</span>
              <span className="font-semibold text-red-500">1</span>
            </p>

            <p className="flex justify-between">
              <span>Waiting:</span>
              <span className="font-semibold">2</span>
            </p>

            <p className="flex justify-between border-t pt-3 border-black/10">
              <span>Total Operations:</span>
              <span className="font-semibold">7</span>
            </p>
          </div>
        </div>
    </Link>
      </div>
    </div>
  );
}
