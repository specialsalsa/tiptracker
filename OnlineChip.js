import React, {useEffect, useState} from 'react';
import {Chip} from 'react-native-paper';
import axios from 'axios';

const OnlineChip = props => {
  return (
    <Chip
      icon={props.isConnected ? 'emoticon-outline' : 'emoticon-dead-outline'}
      theme={{colors: {primary: props.isConnected ? 'lightgreen' : 'red'}}}>
      {props.isConnected ? 'Connected' : 'Disconnected'}
    </Chip>
  );
};

export default OnlineChip;
