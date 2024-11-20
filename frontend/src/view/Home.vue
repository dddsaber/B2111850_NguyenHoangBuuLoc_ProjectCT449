<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(to bottom, #666, #fff);
    "
  >
    <h1
      style="
        font-size: 36px;
        font-family: 'Open Sans', sans-serif;
        color: #1b233e;
      "
    >
      Welcome to library management
    </h1>
    <div style="display: flex; align-items: flex-end; gap: 50px">
      <div class="candle">
        <div class="shadow"></div>
        <div class="wick"></div>
        <div class="flame"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:800,300);

.candle {
  position: absolute;
  width: 60px;
  height: 100px;
  top: 160px;
  left: 80%;
  top: 40%;
  background: #fff;
  border-radius: 3px;
  box-shadow: inset -10px 0 0 0 #e0e5ff;

  .shadow {
    position: absolute;
    width: 120px;
    height: 8px;
    background: #1b233e;
    bottom: -8px;
    left: -30px;
    border-radius: 3px;
  }

  .wick {
    position: absolute;
    width: 4px;
    height: 15px;
    top: -15px;
    left: 28px;
    background: #ad88a9;
    border-radius: 2px 2px 0 0;
  }

  .flame {
    position: absolute;
    width: 16px;
    height: 26px;
    top: -32px;
    left: 22px;
    background: #ffad00;
    border-radius: 8px 8px 8px 8px / 20px 20px 8px 8px;
    animation: wind 15s ease-in-out infinite, size 20s ease-in-out infinite,
      flickr 5s ease-in-out infinite;
    transform-origin: 50% 100%;
  }
}

@keyframes wind {
  0%,
  22%,
  49%,
  62%,
  81%,
  100% {
    border-radius: 2px 14px 8px 8px / 20px 20px 8px 8px;
  }
  14%,
  32%,
  56%,
  70%,
  89% {
    border-radius: 14px 2px 8px 8px / 20px 20px 8px 8px;
  }
}

@keyframes size {
  0%,
  22%,
  49%,
  62%,
  81%,
  100% {
    transform: scale(1, 1);
  }
  14%,
  32%,
  56%,
  70%,
  89% {
    transform: scale(0.9, 1.2);
  }
}

@keyframes flickr {
  0%,
  22%,
  49%,
  62%,
  81%,
  100% {
    box-shadow: 0 0 20px 0 rgba(255, 202, 0, 0.7);
  }
  14%,
  32%,
  56%,
  70%,
  89% {
    box-shadow: 0 0 20px 0 rgba(255, 202, 0, 0.8);
  }
}
</style>
