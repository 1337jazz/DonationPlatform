import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const routerTransitions = trigger('triggerName', [
  transition('*<=>*', [

    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ],  {optional : true}),

    query(':enter', [style({ right: '-100%', opacity: 0 })], {optional : true}),

    query(':leave', animateChild(),  {optional : true}),

    group([
      query(':leave', [animate('100ms ease-in-out', style({ right: '100%', opacity: 0 }))], {optional : true}),
      query(':enter', [animate('300ms ease-out', style({ right: '0%', opacity: 1 }))], {optional : true})
    ]),

    query(':enter', animateChild(), {optional : true})

  ])
]);


