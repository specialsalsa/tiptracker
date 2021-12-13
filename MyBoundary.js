import {useEffect} from 'react';
import Boundary, {Events} from 'react-native-boundary';

export const myBoundary = () => {
  Boundary.add({
    lat: 32.749260662,
    lng: -117.014085,
    radius: 50, // in meters
    id: 'Chipotle',
  })
    .then(() => console.log('success!'))
    .catch(e => console.error('error :(', e));

  Boundary.on(Events.ENTER, id => {
    // Prints 'Get out of my Chipotle!!'
    console.log(`Get out of my ${id}!!`);
  });

  Boundary.on(Events.EXIT, id => {
    // Prints 'Ya! You better get out of my Chipotle!!'
    console.log(`Ya! You better get out of my ${id}!!`);
  });

  return () => {
    Boundary.off(Events.ENTER);
    Boundary.off(Events.EXIT);

    // Remove the boundary from native API´s
    Boundary.remove('Chipotle')
      .then(() => console.log('Goodbye Chipotle :('))
      .catch(e => console.log('Failed to delete Chipotle :)', e));
  };
};
