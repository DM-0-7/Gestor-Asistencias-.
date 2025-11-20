import { ref } from 'process';
import { types } from 'util';

//poder importar archivos SVG como componentes de React
declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;
    
    const src: string;
    export default src;
}