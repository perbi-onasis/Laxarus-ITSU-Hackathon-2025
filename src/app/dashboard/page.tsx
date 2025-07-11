import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Top bar */}

      {/* Top cards */}
      <div className="flex gap-4 w-11/12 max-w-xl mb-8 overflow-x-auto">
        <div className="rounded-2xl bg-white shadow p-2 min-w-[140px] flex items-center justify-center">
          <Image
            src="/images/tti_logo.png"
            alt="Takoradi Technical Institute Logo"
            width={120}
            height={60}
            className="object-contain rounded-xl"
          />
        </div>
        <div className="rounded-2xl bg-white shadow p-2 min-w-[140px] flex items-center justify-center">
          <Image
            src="/images/studying_woman.jpg"
            alt="Woman studying"
            width={120}
            height={60}
            className="object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Download Academic Documents */}
      <h2 className="text-xl font-bold mb-4">Download Academic Documents</h2>
      <div className="flex gap-4 mb-8">
        <button className="flex flex-col items-center bg-white rounded-2xl shadow p-2 min-w-[100px]">
          <Image
            src="/images/testimonial_icon.jpg"
            alt="Testimonial Icon"
            width={60}
            height={60}
            className="rounded-xl object-cover"
          />
          <span className="mt-2 text-black">Testimonial</span>
        </button>
        <button className="flex flex-col items-center bg-white rounded-2xl shadow p-2 min-w-[100px]">
          <Image
            src="/images/attestation_icon.jpg"
            alt="Attestation Icon"
            width={60}
            height={60}
            className="rounded-xl object-cover"
          />
          <span className="mt-2 text-black">Attestation</span>
        </button>
        <button className="flex flex-col items-center bg-white rounded-2xl shadow p-2 min-w-[100px]">
          <Image
            src="/images/certificate_icon.jpg"
            alt="Certificate Icon"
            width={60}
            height={60}
            className="rounded-xl object-cover"
          />
          <span className="mt-2 text-black">Certificate</span>
        </button>
      </div>

      {/* Rate us */}
      <div className="w-11/12 max-w-xl bg-gray-50 rounded-2xl p-4 mb-24 shadow">
        <p className="font-semibold mb-1">Rate us! 🎉</p>
        <p className="text-gray-700">How useful is the app?</p>
      </div>

      {/* Bottom nav bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-blue-700 py-4 flex justify-center items-center">
        <button className="bg-white rounded-full p-3 border-4 border-blue-700">
          <span className="text-blue-700 text-2xl">🏠</span>
        </button>
      </footer>
    </div>
  );
}
