export interface ServiceToInject {
    [key: string]: any;

    /**
     * @description this should be the scope type it can only be 
     * 'request' | 'transient' | 'singleton'
     */
    scopeType?: String | 'request' | 'transient' | 'singleton';

    tag?: string;

    /**
     * @description this should be class that you want to inject later
     * @required
     */
    service?: any;
}