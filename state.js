import {proxy, useSnapshot} from 'valtio';

const state = proxy({
  enabled: true,
});

export default state;
