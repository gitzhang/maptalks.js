import { isNil, isArray, isNumber, isCoordinate, mapArrayRecursively } from 'core/util';

/**
 * Represents a coordinate point <br>
 * e.g. <br>
 * a geographical point with a certain latitude and longitude <br>
 * a point in a indoor room
 * @example
 * var coord = new Coordinate(0, 0);
 * @example
 * var coord = new Coordinate([0,0]);
 * @example
 * var coord = new Coordinate({x:0, y:0});
 * @class
 * @category basic types
 * @param {Number} x - x value
 * @param {Number} y - y value
 */
export default class Coordinate {
    constructor(x, y) {
        if (!isNil(x) && !isNil(y)) {
            /**
             * @property {Number} x - value on X-Axis or longitude in degrees
             */
            this.x = +(x);
            /**
             * @property {Number} y - value on Y-Axis or Latitude in degrees
             */
            this.y = +(y);
        } else if (isArray(x)) {
            //数组
            this.x = +(x[0]);
            this.y = +(x[1]);
        } else if (!isNil(x['x']) && !isNil(x['y'])) {
            //对象
            this.x = +(x['x']);
            this.y = +(x['y']);
        }
        if (this.isNaN()) {
            throw new Error('coordinate is NaN');
        }
    }

     /**
     * Convert one or more Coordinate objects to GeoJSON style coordinates
     * @param  {Coordinate|Coordinate[]} coordinates - coordinates to convert
     * @return {Number[]|Number[][]}
     * @static
     * @example
     * // result is [[100,0], [101,1]]
     * var numCoords = Coordinate.toNumberArrays([new Coordinate(100,0), new Coordinate(101,1)]);
     */
    static toNumberArrays(coordinates) {
        if (!isArray(coordinates)) {
            return [coordinates.x, coordinates.y];
        }
        return mapArrayRecursively(coordinates, function (coord) {
            return [coord.x, coord.y];
        });
    }

    /**
     * Convert one or more GeoJSON style coordiantes to Coordinate objects
     * @param  {Number[]|Number[][]} coordinates - coordinates to convert
     * @return {Coordinate|Coordinate[]}
     * @static
     * @example
     * var coordinates = Coordinate.toCoordinates([[100,0], [101,1]]);
     */
    static toCoordinates(coordinates) {
        if (isNumber(coordinates[0]) && isNumber(coordinates[1])) {
            return new Coordinate(coordinates);
        }
        var result = [];
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var child = coordinates[i];
            if (isArray(child)) {
                if (isNumber(child[0])) {
                    result.push(new Coordinate(child));
                } else {
                    result.push(this.toCoordinates(child));
                }
            } else {
                result.push(new Coordinate(child));
            }
        }
        return result;
    }

    /**
     * Returns a copy of the coordinate
     * @return {Coordinate} copy
     */
    copy() {
        return new Coordinate(this.x, this.y);
    }

    //destructive add, to improve performance in some circumstances.
    _add(x, y) {
        if (x instanceof Coordinate) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    /**
     * Returns the result of addition of another coordinate.
     * @param {Coordinate} coordinate - coordinate to add
     * @return {Coordinate} result
     */
    add(x, y) {
        var nx, ny;
        if (x instanceof Coordinate) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Coordinate(nx, ny);
    }

    //destructive substract
    _substract(x, y) {
        if (x instanceof Coordinate) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    /**
     * Returns the result of subtraction of another coordinate.
     * @param {Coordinate} coordinate - coordinate to substract
     * @return {Coordinate} result
     */
    substract(x, y) {
        var nx, ny;
        if (x instanceof Coordinate) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Coordinate(nx, ny);
    }

    /**
     * Returns the result of multiplication of the current coordinate by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {Coordinate} result
     */
    multi(ratio) {
        return new Coordinate(this.x * ratio, this.y * ratio);
    }

    _multi(ratio) {
        this.x *= ratio;
        this.y *= ratio;
        return this;
    }

    /**
     * Compare with another coordinate to see whether they are equal.
     * @param {Coordinate} c2 - coordinate to compare
     * @return {Boolean}
     */
    equals(c2) {
        if (!isCoordinate(c2)) {
            return false;
        }
        return this.x === c2.x && this.y === c2.y;
    }

    /**
     * Whether the coordinate is NaN
     * @return {Boolean}
     */
    isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    }

    /**
     * Convert the coordinate to a number array [x, y]
     * @return {Number[]} number array
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Convert the coordinate to a json object {x : .., y : ..}
     * @return {Object} json
     */
    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
}
