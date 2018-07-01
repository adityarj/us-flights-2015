app.service('tickService',function() {
	var padding = 3;

	//Function to handle force tick, code is adapted from Mike Bostock's Dorling Cartogram example
	this.tick = function(data,alpha) {
		for (var i = 0; i < data.length; i++) {
			var g = gravity(alpha * 0.1,data[i]);
			data[i].x = g[0];
			data[i].y = g[1];

			var c = collide(data,0.2,data[i]);
			data[i].x = c[0];
			data[i].y = c[1];
		}

		return data;
	}

	function gravity(k,d) {
		return [d.x + (d.x0 - d.x) * k, d.y + (d.y0 - d.y) * k];
	}

	function collide(data,k,node) {
		var q = d3.geom.quadtree(data);
		var nr = node.r + padding,
				nx1 = node.x - nr,
				nx2 = node.x + nr,
				ny1 = node.y - nr,
				ny2 = node.y + nr;

		q.visit(function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
						y = node.y - quad.point.y,
						l = x * x + y * y,
						r = nr + quad.point.r;
				if (l < r * r) {
					l = ((l = Math.sqrt(l)) - r) / l * k;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});

		return [node.x,node.y];
	}
})