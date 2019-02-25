VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
VerletParticle2D = toxi.physics2d.VerletParticle2D;
VerletSpring2D = toxi.physics2d.VerletSpring2D;
VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D;
Vec2D = toxi.geom.Vec2D;
Rect = toxi.geom.Rect;

//Force directed graph functions

function forEachNested(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            var result = fn(arr[i], arr[j], i, j, arr);
            if (result === false) {
                return;
            }
        }
    }
}

function Graph(nodes, imSize) {
    this.nodes = nodes;
    var d_sq = imSize * imSize;
    var minDist = Math.sqrt(d_sq + d_sq);

    for (var i = 1; i < this.nodes.length; i++) {
        var pi = this.nodes[i];

        for (var j = 0; j < i; j++) {
            var pj = this.nodes[j];
            let d = Math.max(minDist, pi.distanceTo(pj))
            d = minDist;
            physics.addSpring(new VerletMinDistanceSpring2D(pi, pj, d, 0.1));
        }
    }
}

Graph.prototype.showConnections = function (p) {
    p.stroke(0, 150);
    forEachNested(this.nodes, function (pi, pj) {
        p.line(pi.x, pi.y, pj.x, pj.y);
    });
}

makeGraph = function (coords, physics, imSize) {
    physics.clear();
    nodes = [];
    for (let idx = 0; idx < coords.length; idx++) {
        let c = coords[idx];
        let v = new Vec2D(c[0] + imSize / 2, c[1] + imSize / 2);
        let n = new VerletParticle2D(v);
        nodes.push(n)
    }
    return new Graph(nodes, imSize);
}


getPhysics =function(imSize, width, height){
    physics =new VerletPhysics2D();
    physics.setWorldBounds(new Rect(imSize  / 2+ 5, imSize / 2 + 5,
        width - imSize - 5, height - imSize) - 5);
    return physics;
}