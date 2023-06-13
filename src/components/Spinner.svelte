<script>
    export let isLoading = false;
  </script>
  
  {#if isLoading}
    <div class="container">
        <div class="spinner"></div>
    </div>
  {/if}
  
<style>

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .spinner {
        margin-top: 50%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
</style>