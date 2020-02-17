var pressureVal
const feedback = document.querySelector('#feedback')
const giveFeedback = a => feedback.innerHTML = a


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    painting = false,
    lastX = 0,
    lastY = 0,
    lineThickness = 1;

canvas.width = innerWidth-20
canvas.height = innerHeight-20;
ctx.fillRect(0, 0, innerWidth * 4, innerHeight * 4);

const drawStart = function (e) {
    console.log('force', e)

    painting = true;
    ctx.fillStyle = "#ffffff";
    lastX = e.pageX ? e.pageX : e.touches[0].pageX - this.offsetLeft;
    lastY = e.pageY ? e.pageY : e.touches[0].pageY - this.offsetTop;
}

const drawStop = function (e) {
    painting = false;
}

const drawMove = function (e) {
    if (painting) {
        mouseX = e.pageX ? e.pageX : e.touches[0].pageX - this.offsetLeft;
        mouseY = e.pageY ? e.pageY : e.touches[0].pageY - this.offsetTop;
        // find all points between        
        var x1 = mouseX,
            x2 = lastX,
            y1 = mouseY,
            y2 = lastY;


        var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
        if (steep) {
            var x = x1;
            x1 = y1;
            y1 = x;

            var y = y2;
            y2 = x2;
            x2 = y;
        }
        if (x1 > x2) {
            var x = x1;
            x1 = x2;
            x2 = x;

            var y = y1;
            y1 = y2;
            y2 = y;
        }

        var dx = x2 - x1,
            dy = Math.abs(y2 - y1),
            error = 0,
            de = dy / dx,
            yStep = -1,
            y = y1;

        if (y1 < y2) {
            yStep = 1;
        }

        lineThickness = 5 - Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 10;
        if (lineThickness < 1) {
            lineThickness = 1;
        }
        e.touches && e.touches[0] 
            ? pressureVal=e.touches[0].force * 2
            : pressureVal=1
        for (var x = x1; x < x2; x++) {
            if (steep) {
                ctx.fillRect(y, x, pressureVal, pressureVal);
            } else {
                ctx.fillRect(x, y, pressureVal, pressureVal);
            }
            // if (steep) {
            //     ctx.fillRect(y, x, lineThickness , lineThickness );
            // } else {
            //     ctx.fillRect(x, y, lineThickness , lineThickness );
            // }
            error += de;
            if (error >= 0.5) {
                y += yStep;
                error -= 1.0;
            }
        }



        lastX = mouseX;
        lastY = mouseY;

    }
    giveFeedback(pressureVal)
}



canvas.addEventListener('mousedown', drawStart);
canvas.addEventListener('touchstart', drawStart);

canvas.addEventListener('mouseup', drawStop)
canvas.addEventListener('touchend', drawStop)

canvas.addEventListener('mousemove', drawMove)
canvas.addEventListener('touchmove', drawMove)