<script lang="ts">
  import { onMount } from "svelte";
  import Text from "./components/Text.svelte";

  onMount(() => {
    // Listen for messages from the extension
    tsvscode.postMessage({ type: "onOpen" });

    window.addEventListener("message", (event) => {
      console.log("Message received from extension:", event.data);
      // Handle the message here
    });
  });
</script>

<Text />
