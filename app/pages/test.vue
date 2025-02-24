<template>
<div class="relative w-full max-w-sm items-center">
    <Input id="search" type="text" placeholder="Search..." class="pl-10" />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path></svg>
    </span>
  </div>
  <div class="relative m-auto h-48 w-80 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl transition-transform sm:h-56 sm:w-96 sm:hover:scale-110">
    <div class="absolute top-4 w-full px-8 sm:top-8">
      <div class="flex justify-between">
        <div class="">
          <img class="w-10 object-contain" src="img/puce.png" />
        </div>
        <img class="w-10 object-contain" src="img/contactless.png" />
      </div>
      <div class="mt-9 pt-1">
        <p class="tracking-more-wider font-medium">0006 2345 7453 2345</p>
      </div>
      <div class="pt-4 sm:pt-6">
        <div class="flex justify-between">
          <div class="">
            <p class="text-xs font-light">Card Holder</p>
            <p class="text-base font-medium tracking-widest">FLOQUET Louis</p>
          </div>

          <img class="w-14 object-contain" src="img/mastercard.png" />
        </div>
      </div>
    </div>
  </div>
</template>
