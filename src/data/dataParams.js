import { writable } from 'svelte/store';
export let dataparams = writable([])
export let isgridUpdate = writable();
export let isrefresh = writable();