export class Graphics {
    static Context: CanvasRenderingContext2D;

    static grid(x: number, y: number, w: number, h: number, s: number) {
        const { Context: c } = Graphics;

        if (!c) return;

        c.beginPath()

        const linesV = (w / s) >> 0;
        const linesH = (h / s) >> 0;

        for (let i = 0; i <= linesH; i++) {
            const x1 = x;
            const x2 = x + w;
            const _y = y + s * i;
            
            c.moveTo(x1, _y);
            c.lineTo(x2, _y);
        }

        for (let i = 0; i <= linesV; i++) {
            const y1 = y;
            const y2 = y + h;
            const _x = x + s * i;
            
            c.moveTo(_x, y1);
            c.lineTo(_x, y2);
        }


        c.stroke();
    }
}