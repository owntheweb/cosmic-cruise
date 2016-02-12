//thanks: http://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
THREE.Utils = {
    //thanks: http://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector/15697227#15697227
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.eulerOrder);
        return vector;
    },
    
    //thanks: http://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
    getPointInBetweenByLen: function(pointA, pointB, length) {
    	var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    	return pointA.clone().add(dir);
    },
    getPointInBetweenByPerc: function(pointA, pointB, percentage) { //percentage = 0-1
    	var dir = pointB.clone().sub(pointA);
    	var len = dir.length();
    	dir = dir.normalize().multiplyScalar(len*percentage);
    	return pointA.clone().add(dir);
    },
    
    //move a vector to the boundary of a sphere radius relative to an observation vector of 0,0,0
    moveVectorToSphereEdge: function(v, r) {
	    var distFromCenter = Math.sqrt(Math.pow(v.x,2) + Math.pow(v.y,2) + Math.pow(v.z,2));
	    var x = r * v.x / distFromCenter;
	    var y = r * v.y / distFromCenter;
	    var z = r * v.z / distFromCenter;

	    return new THREE.Vector3(x, y, z);
	}
};