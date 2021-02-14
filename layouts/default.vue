<template>
  <div>
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <div
                  class="text-gray-300 px-3 py-2 rounded-md text-lg font-medium"
                >
                  FortyMM
                </div>
              </div>
            </div>
          </div>
          <div class="md:block">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
    <Nuxt />
  </div>
</template>
