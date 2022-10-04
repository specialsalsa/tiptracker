import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';

const UpdateSnackbar = props => {
  const onDismissSnackBar = () => {
    props.setSnackbarVisible(false);
  };

  const handleSnackbarVisible = () => {
    props.setSnackbarVisible(!props.visible);
  };

  return (
    <Snackbar
      visible={props.visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'OK',
        onPress: () => {
          onDismissSnackBar();
        },
      }}>
      {props.snackbarContent}
    </Snackbar>
  );
};

export default UpdateSnackbar;
