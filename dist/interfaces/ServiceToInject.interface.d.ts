export interface ServiceToInject {
    [key: string]: any;
    scopeType?: String | 'request' | 'transient' | 'singleton';
    tag?: string;
    service?: any;
}
