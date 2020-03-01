/* eslint-disable @typescript-eslint/no-explicit-any */
import { Principal } from './identity';
import AccessControlFramework from './framework';

interface StaticAuthorizationStrategy {
    ({ principal }: { principal: Principal }): boolean;
}

export class Resource {
    private _framework: AccessControlFramework;
    private _name: string;
    private _preflightAuthorizationStrategy: StaticAuthorizationStrategy;

    constructor({ framework, name, preflightAuthorizationStrategy }: { 
        framework: AccessControlFramework; 
        name: string;
        preflightAuthorizationStrategy: StaticAuthorizationStrategy;
    })  {
        this._name = name;
        this._framework = framework;
        this._preflightAuthorizationStrategy = preflightAuthorizationStrategy;

        this._framework.registerResource(this);
    }

    public get name(): string {
        return this._name;
    }

    public authorizePreflight({ principal }: { principal: Principal }): boolean {
        return this._preflightAuthorizationStrategy({ principal });
    }
}

