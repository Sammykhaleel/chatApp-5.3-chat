// import React, { Component } from "react";
// // import { StyleSheet, View, Text, TextInput, Button } from "react-native";
// import Chat from "./components/Chat";
// import Start from "./components/Start";
// // import react native gesture handler
// import "react-native-gesture-handler";

// // import react Navigation
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";

// const Stack = createStackNavigator();

// export default class App extends React.Component {
//   render() {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Start">
//           <Stack.Screen name="Start" component={Start} />
//           <Stack.Screen name="Chat" component={Chat} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }

import React from "react";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import firebase from "firebase";
import firestore from "firebase";

// const firebase = require('firebase');
// require('firebase/firestore');
// require('firebase/auth')

// Careful, this is just an example, you need to implement the same ideas here in Chat.js then import Chat component to App.js and use it there.
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: "Please wait, you are getting logged in",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp({
        // insert your Firestore database credentials here!
      });
    }

    this.referenceShoppinglistUser = null;
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  addList() {
    // add a new list to the collection
    this.referenceShoppingLists.add({
      name: "TestList",
      items: ["eggs", "pasta", "veggies"],
      uid: this.state.uid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>

        <Text style={styles.text}>All Shopping lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.name}: {item.items}
            </Text>
          )}
        />

        <Button
          onPress={() => {
            this.addList();
          }}
          title="Add something"
        />
      </View>
    );
  }

  componentDidMount() {
    // creating a references to shoppinglists collection
    this.referenceShoppingLists = firebase
      .firestore()
      .collection("shoppinglists");

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: "Hello there",
      });

      // create a reference to the active user's documents (shopping lists)
      this.referenceShoppinglistUser = firebase
        .firestore()
        .collection("shoppinglists")
        .where("uid", "==", this.state.uid);
      // listen for collection changes for current user
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(
        this.onCollectionUpdate
      );
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});

export default App;
