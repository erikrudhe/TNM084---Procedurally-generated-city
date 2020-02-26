
function generateCity(){

    clearScene();

    // Add Light 
    var hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 5.25);
    hemLight.position.set(0.75, 1, 0.25);
    scene.add(hemLight);

   // var amblight = new THREE.AmbientLight(0xfffff0, 0.85 ); 
   // scene.add( amblight );

    var buildingLight = new THREE.PointLight(0xffffff, 8.0);
    scene.add(buildingLight);

    // Add ground
    var planeGeometry = new THREE.PlaneGeometry(2100,2100,32);      
    var planeMaterial = new THREE.MeshBasicMaterial( {color:"#080808" , side: THREE.DoubleSide} );
    var ground = new THREE.Mesh(planeGeometry,planeMaterial);
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // Geomtry for the buildings
    var boxGeometry = new THREE.BoxGeometry(1,1,1);

    // Translate pivot to the bottom 
    boxGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    // Remove the bottom surface
    boxGeometry.faces.splice(6,2);
    boxGeometry.faceVertexUvs[0].splice(6,2);    

    // Remove texture on top of building
    boxGeometry.faceVertexUvs[0][5][2].set(0, 0);
    boxGeometry.faceVertexUvs[0][4][2].set(0, 0);
    
    // Build mesh
    var buildingMesh = new THREE.Mesh(boxGeometry);
    cityGeometry = new THREE.Geometry();
 
    for(var i = 0; i < 750; i ++){
        
          // Position of building
          buildingMesh.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
          buildingMesh.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;    
        
          // Scale and size buildings
          buildingMesh.scale.x  = Math.random() *Math.random() * Math.random()* Math.random() * 40 + 40;
          buildingMesh.scale.z  = buildingMesh.scale.x
         
          // Height
          buildingMesh.scale.y  = (Math.random()  * buildingMesh.scale.x) * 8 + 8;
        
          // Merge with cityGeometry
          buildingMesh.updateMatrix();
          //cityGeometry.merge(buildingMesh.boxGeometry, buildingMesh.matrix);
         THREE.GeometryUtils.merge(cityGeometry, buildingMesh)
    }

    cityTexture();

}

function cityTexture() {

        var texture = new THREE.Texture(buildTexture());
        texture.anisotropy = renderer.getMaxAnisotropy(); 
        texture.needsUpdate = true;

        var material = new THREE.MeshLambertMaterial({
            map: texture,
            vertexColors: THREE.VertexColors

        });

        var cityMesh = new THREE.Mesh(cityGeometry, material);

        scene.add(cityMesh);

}

function buildTexture(){
    

        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 64;
        var context = canvas.getContext('2d');

        context.fillStyle = '#000000';
        context.fillRect(0,0,32,64);

        for(var y = 2; y < 64; y +=2){
            for(var x = 1; x < 32; x +=2){
                var value = Math.floor(Math.random() * Math.random() * 64);
                context.fillStyle =  "rgb(" + [value,value,value].join(",") + ")";
                context.fillRect(x,y,1,1);
            }
        }

        var canvas2 = document.createElement('canvas');
        canvas2.width = 512;
        canvas2.height = 1024;
        var context = canvas2.getContext('2d');

        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;

        context.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);

        return canvas2; 

    }

    function clearScene() {

        while (scene.children.length > 0) {
    
            scene.remove(scene.children[0]);
        }
        
    }
    
