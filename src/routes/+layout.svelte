<script>
   import "../app.css";
    //slot tag contains all the code from +page.svelte
    import Sidebar from "../components/Sidebar.svelte";
    import SidebarLayer2 from "../components/Sidebar_layer2.svelte";
    import Footer from "../components/Footer.svelte";
</script>

<div class="flex">
    <Sidebar/>
    <SidebarLayer2/>
</div>

<h2>text in Main +layout.svelte</h2>
<!-- <Footer/> -->

<slot />


<hr>

