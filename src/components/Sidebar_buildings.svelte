<script>
import { fly } from 'svelte/transition';
</script>

<nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}>
    <a href="/buildings/VAT83A">VAT83A</a>
    <a href="/buildings/KH7">KH7</a>
    <a href="/buildings/Japan">Japan</a>
    <a href="/buildings/Seattle">Seattle</a>
    <a href="/buildings/Milan">Milan</a>

    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
    <img src="/icon_logo.jpg" alt="">
</nav>

<style>
    nav {
      top: 0;
      height: 100%;
      padding: 2rem 1rem 0.6rem;
      overflow-y: auto;
      width: 310px;
        display: inline-block
    }

    ::-webkit-scrollbar {
  width: 6px;
  background-color: #ffffffe7;
}

::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  border-radius: 10px;
}


::-webkit-scrollbar-thumb:hover {
  background-color: #b8b8b8;
  width: 15px;
}
    </style>