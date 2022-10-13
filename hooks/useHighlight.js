import React, {useState} from 'react';

const useHighlight = tipRating => {
  let highlight = {};

  if (tipRating.includes('Bad') || tipRating.includes('Shit')) {
    highlight = {bad: 'contained', okay: 'outlined', great: 'outlined'};
  } else if (tipRating.includes('Okay')) {
    highlight = {bad: 'outlined', okay: 'contained', great: 'outlined'};
  } else if (tipRating.includes('Good') || tipRating.includes('Great')) {
    highlight = {bad: 'outlined', okay: 'outlined', great: 'contained'};
  } else {
    highlight = {bad: 'outlined', okay: 'outlined', great: 'outlined'};
  }

  return highlight;
};

export default useHighlight;
