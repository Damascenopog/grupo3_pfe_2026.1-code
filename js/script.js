(async () => {
    try {
        const [blogMod, videosMod, indicatorsMod, webinarsMod] = await Promise.all([
            import("../src/js/blog.js"),
            import("../src/js/videos.js"),
            import("../src/js/indicadores.js"),
            import("../src/js/webinars.js"),
        ]);

        const tasks = [];
        if (blogMod && typeof blogMod.init === "function")
            tasks.push(blogMod.init());
        if (videosMod && typeof videosMod.init === "function")
            tasks.push(videosMod.init());
        if (indicatorsMod && typeof indicatorsMod.init === "function")
            tasks.push(indicatorsMod.init());
        if (webinarsMod && typeof webinarsMod.init === "function")
            tasks.push(webinarsMod.init());

        await Promise.allSettled(tasks);
    } catch (err) {
        console.error("Erro ao inicializar módulos da home:", err);
    }
})();
