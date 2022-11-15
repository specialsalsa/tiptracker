import {Card, Paragraph, Button} from 'react-native-paper';
import React, {useEffect, useState, useCallback} from 'react';
import {Text, Linking, StyleSheet, ScrollView} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import {LocalNotification, RSSNotification} from './LocalPushController';
import PushNotification from 'react-native-push-notification';

let isDismissed = false;

const RSSCard = props => {
  const [title, setTitle] = useState('asdf');
  const [body, setBody] = useState('asdf');
  const [link, setLink] = useState('asdf');
  const [status, setStatus] = useState('asdf');
  const [visible, setVisible] = useState(true);
  const [statusStyle, setStatusStyle] = useState({});

  const getRSS = useCallback(() => {
    const now = Date.now();
    fetch('https://www.doordashstatus.com/history.rss', {method: 'GET'})
      .then(response => response.text())
      .then(async responseData => await rssParser.parse(responseData))
      .then(rss => {
        setTitle(rss.items[0].title);
        setBody(rss.items[0].published);
        const date = new Date(rss.items[0].published).getTime();

        if (now - date > 1000 * 60 * 30) {
          setVisible(false);
          return;
        }

        PushNotification.getDeliveredNotifications(notifications => {
          if (notifications.some(noti => noti.identifier === '6')) return;
          RSSNotification(rss.items[0].title, rss.items[0].published);
        });

        setLink(rss.items[0].links[0].url);

        if (rss.items[0].description.toLowerCase().includes('resolved')) {
          setStatus('Resolved');
          setStatusStyle({color: 'green'});
          setVisible(true);
        } else if (
          rss.items[0].description.toLowerCase().includes('investigating')
        ) {
          setStatus('Investigating');
          setStatusStyle({color: 'orange'});
          setVisible(true);
        } else if (
          rss.items[0].description.toLowerCase().includes('identified')
        ) {
          setStatus('Identified');
          setStatusStyle({color: 'indianred'});
          setVisible(true);
        }
      });
  });

  useEffect(() => {
    getRSS();

    setInterval(() => {
      getRSS();
    }, 60000);
  }, []);

  return (
    <>
      {visible && (
        <Card style={styles.card}>
          <Card.Title titleNumberOfLines={2} title={title} />
          <Card.Content>
            <Text style={statusStyle}>{status}</Text>
            <Paragraph>{body}</Paragraph>
            <Paragraph>
              <Text
                style={{color: 'blue'}}
                onPress={() => Linking.openURL(link)}>
                {link}
              </Text>
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            {/* <Button
              mode="text"
              onPress={() => {
                isDismissed = true;
                setVisible(false);
              }}>
              Dismiss
            </Button> */}
          </Card.Actions>
        </Card>
      )}
    </>
  );
};

export default RSSCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 50,
    // marginTop: 20,
  },
  cardContainer: {
    // flexShrink: 1,
    // marginTop: 20,
  },
});
