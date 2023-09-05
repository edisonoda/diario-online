import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const inOutAnimationFast = trigger(
  'inOutAnimationFast',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('.3s ease-out',
          style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('.3s ease-in',
          style({ opacity: 0 }))
      ]
    )
  ]
);
