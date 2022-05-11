export class ContextHelper {
    static context: CanvasRenderingContext2D;

    static isolatedTransform(method: () => void) {
        const { context } = ContextHelper;

        if (!context) return;

        context.save();
        method();
        context.restore();
    }
}
