const useHighlight = tipRating => {
  let highlight = {bad: 'default', okay: 'default', great: 'default'};

  if (tipRating.includes('Bad') || tipRating.includes('Shit')) {
    highlight.bad = 'contained';
  } else if (tipRating.includes('Okay')) {
    highlight.okay = 'contained';
  } else if (tipRating.includes('Good') || tipRating.includes('Great')) {
    highlight.great = 'contained';
  }

  return highlight;
};

export default useHighlight;
