import { Component, ComponentType, AnchorHTMLAttributes, Ref } from 'react';
import { History, LocationState, LocationDescriptor, Location } from 'history';

export interface RouterProps {
  history?: History;
}

export class Router extends Component<RouterProps, any> {}

export interface LinkProps<S = LocationState>
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  component?: ComponentType<any>;
  to:
    | LocationDescriptor<S>
    | ((location: Location<S>) => LocationDescriptor<S>);
  replace?: boolean;
  innerRef?: Ref<HTMLAnchorElement>;
}

export class Link<S = LocationState> extends Component<LinkProps<S>, any> {}

export * from 'react-router';
