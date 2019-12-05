/* eslint max-classes-per-file: 0 */
import { Component, ComponentType, AnchorHTMLAttributes, Ref } from 'react';

export interface RebassProps {}

export class Rebass extends Component<RebassProps, any> {}

// export interface LinkProps<S = LocationState>
//   extends AnchorHTMLAttributes<HTMLAnchorElement> {
//   component?: ComponentType<any>;
//   to:
//     | LocationDescriptor<S>
//     | ((location: Location<S>) => LocationDescriptor<S>);
//   replace?: boolean;
//   innerRef?: Ref<HTMLAnchorElement>;
// }

// export class Link<S = LocationState> extends Component<LinkProps<S>, any> {}

export * from 'rebass';
