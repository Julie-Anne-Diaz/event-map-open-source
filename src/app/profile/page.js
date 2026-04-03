export default function ProfilePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 px-4 pb-20">
      <div className="w-full max-w-3xl mx-auto py-12">

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between">

            {/* Left - profile photo and name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ExampleUser</h1>
                <p className="text-gray-500 text-sm">@exampleuser</p>
              </div>
            </div>

            {/* Right - stats */}
            <div className="flex gap-30">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">124</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">98</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Events</p>
              </div>
            </div>

          </div>
        </div>

        {/* Your Events */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Events</h2>
        <ul className="space-y-4">
          <li className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900">Club Meeting</h3>
            <p className="text-gray-500 text-sm">Tuesdays at 6:00 PM, Little Hall</p>
          </li>
          <li className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900">Art Exhibition</h3>
            <p className="text-gray-500 text-sm">Friday, June 21st at Downtown Gallery</p>
          </li>
          <li className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900">Food Truck Festival</h3>
            <p className="text-gray-500 text-sm">Sunday, June 30th at City Square</p>
          </li>
        </ul>

      </div>
    </main>
  );
}