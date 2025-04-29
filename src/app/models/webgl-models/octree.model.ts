import { vec3, vec4 } from "gl-matrix";
import { Vertex } from "./vertex.model";

export enum OctreeNodeState {
    empty,
    occupied,
    filled
}

type tuple8 = [OctreeNode | null, ...(OctreeNode | null)[]] & { length: 8 };

export interface OctreeNode {
    color: vec4,
    state: OctreeNodeState;
    children: tuple8;
    parent: OctreeNode | null;
    level: number;
    position: vec3;
    leafIndex: number | null;
}

export type CollisionData = {
    collision: boolean;
    intersection?: vec4;
    normal?: vec4;
    delta?: vec4;
    t?: number;
}

export class Octree {
    constructor(private _size: number) {
        this._depth = Math.log2(_size);
        this.offset = vec3.fromValues(
            -_size / 2,
            0,
            -_size / 2
        )
        this.leaves = new Array<OctreeNode>(_size * _size * _size);
        this.root = this.createNode(this._depth, this.offset, null);
    }

    private createNode(level: number, position: vec3, parent: OctreeNode | null) {
        const children = new Array<OctreeNode | null>(8) as tuple8;
        
        const node: OctreeNode = {
            color: vec4.create(),
            state: OctreeNodeState.empty,
            children,
            level,
            parent,
            position: position,
            leafIndex: null,
        }

        if (level == 0) {
            const offsetPosition = vec3.clone(position);
            vec3.add(offsetPosition, offsetPosition, [this._size / 2, 0, this._size / 2]);
            node.leafIndex = offsetPosition[0]
            + offsetPosition[1] * this._size
            + offsetPosition[2] * this._size * this._size;
            node.children.fill(null);
            this.leaves[node.leafIndex] = node;
        }
        else {
            level -= 1;
            const width = 2 ** level;  
            const childPosition = vec3.create();
            for (let i = 0; i < 8; i++) {
                const offset = vec3.fromValues(
                    i % 2,
                    (i >> 1) % 2,
                    i >> 2
                );
                vec3.scaleAndAdd(childPosition, position, offset, width);
                node.children[i] = this.createNode(level, vec3.clone(childPosition), node);
            }
        }
        return node;
    }

    private root: OctreeNode;
    private leaves: OctreeNode[];
    private _depth: number;
    private offset: vec3;

    public get depth(): Readonly<number> {
        return this._depth;
    }

    public get size(): Readonly<number> {
        return this._size;
    }

    public get blocks(): Readonly<{ color: vec4, state: OctreeNodeState}[]> {
        return this.leaves.map(node => ({ color: node.color, state: node.state, parent}));
    }

    private getIndex(x: number, y: number, z: number) {
        return Math.round(x + y * this._size + z * this._size * this._size);
    }

    public placeBlock(x: number, y: number, z: number, color: vec4) {
        
        const index = this.getIndex(x, y, z);
        
        if (this.leaves[index].state != OctreeNodeState.empty) {
            return;
        }
        this.leaves[index].state = OctreeNodeState.filled;
        vec4.copy(this.leaves[index].color, color);
        let possiblyFilled = true;
        for (
            let node = this.leaves[index].parent; 
            node != null; 
            node = node.parent
        ) {
            
            if (node.state == OctreeNodeState.empty) {
                node.state = OctreeNodeState.occupied;
                possiblyFilled = false;
            }
            else if (possiblyFilled) {
                node.state = OctreeNodeState.filled;
                for (let child of node.children) {
                    if (child!.state != OctreeNodeState.filled) {
                        possiblyFilled = false;
                        node.state = OctreeNodeState.occupied;
                        break;
                    }
                }
            }
        }
    }
    
    public removeBlock(x: number, y: number, z: number) {
        const index = this.getIndex(x, y, z);
        if (this.leaves[index].state == OctreeNodeState.empty) {
            return;
        }
        this.leaves[index].state = OctreeNodeState.empty;
        let possiblyEmpty = true;
        for (
            let node = this.leaves[index].parent; 
            node != null; 
            node = node.parent
        ) {
            if (node.state == OctreeNodeState.filled) {
                node.state = OctreeNodeState.occupied;
                possiblyEmpty = false;
            }
            else if (possiblyEmpty) {
                node.state = OctreeNodeState.empty;
                for (let child of node.children) {
                    if (child!.state != OctreeNodeState.filled) {
                        possiblyEmpty = false;
                        node.state = OctreeNodeState.occupied;
                        break;
                    }
                }
            }
        }
    }
    
    private testCollisionBoundingBox(start: vec4, delta: vec4, corner1: vec3, corner2: vec3): CollisionData {
        const intersection = vec4.clone(start);
        let t = 0;
        const normal = vec4.create();
        for (let i = 0; i < 3; i++) {
            if (intersection[i] < corner1[i]) {
                t = (corner1[i] - intersection[i] - Number.EPSILON) / delta[i];
                vec4.scaleAndAdd(intersection, intersection, delta, t);
            }
            else if (intersection[i] > corner2[i]) {
                t = (corner2[i] - intersection[i] + Number.EPSILON) / delta[i];
                vec4.scaleAndAdd(intersection, intersection, delta, t);
            }
            
        }
        
        for (let i = 0; i < 3; i++) {
            if (intersection[i] < corner1[i] - Number.EPSILON * 10 || intersection[i] > corner2[i] + Number.EPSILON * 10) {
                // no intersection
                return {
                    collision: false
                };
            }
            if (intersection[i] >= corner1[i] - Number.EPSILON * 10 && intersection[i] <= corner1[i] + Number.EPSILON) {
                normal[i] = -1;
            }
            else if (intersection[i] >= corner2[i] - Number.EPSILON * 10 && intersection[i] <= corner2[i] + Number.EPSILON) {
                normal[i] = 1;
            }
        }
        
        return {
            collision: true,
            intersection,
            delta,
            normal,
            t
        };
    }

    public testCollision(start: vec4, delta: vec4, node: OctreeNode = this.root): CollisionData {
        
        if (node.state == OctreeNodeState.empty) {
            return { collision: false };
        }

        const corner1 = vec3.clone(node.position);
        const corner2 = vec3.clone(node.position);
        const width = 2 ** node.level;
        vec3.add(corner2, corner2, [width, width, width]);

        const collisionData = this.testCollisionBoundingBox(start, delta, corner1, corner2);
        

        if (!collisionData.collision) {
            return { collision: false };
        }
        
        if (node.state == OctreeNodeState.filled) {
            return collisionData;
        }

        const occupied = node.children.filter(child => child != null && child.state != OctreeNodeState.empty);
        
        const initialValue: CollisionData = {
            collision: false,
            delta: [0, 0, 0, 0],
            intersection: [0, -1, 0, 0],
            normal: [0, 0, 0, 0],
            t: Number.MAX_VALUE
        };

        return occupied.reduce((firstCollision: CollisionData, node) => {
            const nextCollision = this.testCollision(collisionData.intersection!, delta, node!);
            if (nextCollision.collision && nextCollision.t! < firstCollision.t!) {
                firstCollision = nextCollision;
            }
            return firstCollision;
        }, initialValue);
    }
}