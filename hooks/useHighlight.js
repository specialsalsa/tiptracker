import React, {useState} from 'react';

const useHighlight = tipRating => {
  let highlight = {};

  if (tipRating.includes('Bad') || tipRating.includes('Shit')) {
    highlight = {bad: 'contained', okay: 'default', great: 'default'};
  } else if (tipRating.includes('Okay')) {
    highlight = {bad: 'default', okay: 'contained', great: 'default'};
  } else if (tipRating.includes('Good') || tipRating.includes('Great')) {
    highlight = {bad: 'default', okay: 'default', great: 'contained'};
  } else {
    highlight = {bad: 'default', okay: 'default', great: 'default'};
  }

  return highlight;
};

export default useHighlight;
