import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FavouriteContext } from '../context/FavouriteContext';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * UserProfileScreen component displays and allows editing of user profile information.
 */
const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);
  const { setFavorites } = useContext(FavouriteContext); 
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`http://172.20.10.3:5000/api/auth/profile/${user.userId}`);
          const userData = response.data;
          setUsername(userData.username);
          setEmail(userData.email);
          setDisplayName(userData.displayName);
          setProfileImage(userData.profileImage ? `http://172.20.10.3:5000${userData.profileImage}` : null);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  /**
   * Handles user logout, clears favorites, and navigates to the login screen.
   */
  const handleLogout = () => {
    signOut();
    setFavorites([]);
    navigation.replace('Login');
  };
  
  /**
   * Opens the image picker to select a profile image.
   */
  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

   /**
   * Uploads the selected profile image to the server.
   * @param {string} uri - The URI of the selected image.
   */
  const uploadImage = async (uri) => {
    let localUri = uri;
    let filename = localUri.split('/').pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('profileImage', { uri: localUri, name: filename, type });
    formData.append('userId', user.userId);

    try {
      const response = await axios.post('http://172.20.10.3:5000/api/auth/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileImage(`http://172.20.10.3:5000${response.data.profileImage}`);
      Alert.alert('Success', 'Profile image uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Error uploading profile image');
    }
  };

  /**
   * Updates the user's profile information on the server.
   */
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`http://172.20.10.3:5000/api/auth/profile/${user.userId}`, {
        displayName,
        email,
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Error updating profile');
    }
  };

  return (
    <LinearGradient
    colors={['#87CEEB', '#f5f5f5']}
    style={styles.container}>
      <Image
        source={profileImage ? { uri: profileImage } : require('../assets/images/default_user.png')}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{username}</Text>
      <TextInput
        label="NickName"
        mode="outlined"
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        theme={{ colors: { primary: '#297687' } }} 
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        theme={{ colors: { primary: '#297687' } }} 
      />
      <Button
        mode="contained"
        onPress={handleUpdateProfile}
        style={styles.button}
      >
        Update Profile
      </Button>
      <Button
        mode="contained"
        onPress={pickImage}
        style={styles.button}
      >
        Change Profile Image
      </Button>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 220,
    height: 220,
    borderRadius: 120,
    marginBottom: 20,
  },
  username: {
    fontSize: 28,
    marginBottom: 20,
    color: '#1a3036',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: '#297687',
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#7aabb6',
  },
});

export default UserProfileScreen;
