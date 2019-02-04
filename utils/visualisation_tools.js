VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
VerletParticle2D = toxi.physics2d.VerletParticle2D,
VerletSpring2D = toxi.physics2d.VerletSpring2D,
VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D,
Vec2D = toxi.geom.Vec2D,
Rect = toxi.geom.Rect;

function times(n, fn){
    var arr = [];
    for(var i=0; i<n; i++){
        arr.push(fn(i,n));
    }
    return arr;
};

function organize_points( point_array, min_distance, bounds){
    physics = new VerletPhysics2D();
    
}