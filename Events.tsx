import React from 'react';

import * as Types from './Types'
import {copyUpdate,getTargetValue,addHours,addDays,addMinutes} from './Shared';
import { Diagnostic } from './SharedComponents'
type EventCalcState = {
  days:number
  hours:number
  minutes:number
}
type EventCalcProps = {
  theme:string
  state:EventCalcState
  onStateChange:Types.Action1<EventCalcState>
}
export let EventCalc = 
  (props:EventCalcProps) => {
    let dt = new Date();
    return (<div className={props.theme}><div className='columns'>
            <div className='column'>
              Days: <input type='number' defaultValue={props.state.days as any} className='input' onChange={getTargetValue('Days', x => props.onStateChange(copyUpdate(props.state,'days',+x)))} />
            </div>
            <div className='column'>
              Hours: <input type='number' defaultValue={props.state.hours as any} onChange={getTargetValue('Hours', x => props.onStateChange(copyUpdate(props.state,'hours',+x)))} className='input' />
            </div>
            <div className='column'>
              Minutes: <input type='number' defaultValue={props.state.minutes as any} onChange={getTargetValue('Minutes', x => props.onStateChange(copyUpdate(props.state,'minutes',+x)))} className='input' />
            </div>
            </div>
            <div className='columns'>
            <div className='column'>
              <span className='bd-outline'>{dt.toLocaleString()}</span> + <span className='bd-outline'>{props.state.days} days</span> + <span className='bd-outline'>{props.state.hours} hours</span> + <span className='bd-outline'>{props.state.minutes} minutes</span> <span> = </span>
              <span className='bd-outline'>{addMinutes(addHours(addDays(dt,props.state.days),props.state.hours),props.state.minutes).toLocaleString()}</span>
            </div>
            <Diagnostic value={props.state} show={true}  />
          </div></div>);}