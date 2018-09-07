export class LinkedGraph{
    constructor(
        public links?: Array<any>,
        public nodes?: Array<any>
    ){}
}

export class GraphLink {
    constructor(
        public source: string,
        public target: string,
        public label: string,
        public source_upn: string,
        public target_upn: string
    ){}
}


export class GraphNode {
    constructor(
        public id?: string,
        public photo?: string,
        public label?: string,
        public profile?: any
    ){}
}

export enum Connection{
    Unknow = 0,
    Weak,
    Medium,
    Strong
}