import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { FAB } from 'react-native-paper'
import {
  Camera,
  CameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const Counter = () => {
  const [cameraPermission, setCameraPermission] = useState('denied')
  const [device, setDevice] = useState<CameraDevice>()

  const devices = useCameraDevices('wide-angle-camera')
  useEffect(() => {
    if (devices) {
      setDevice(devices.back)
    }
  }, [devices])

  useEffect(() => {
    const verifyPermissions = async () => {
      console.log('check')
      const localCameraPermission = await Camera.getCameraPermissionStatus()
      setCameraPermission(localCameraPermission)
    }

    verifyPermissions()
  }, [])

  useEffect(() => {
    const requestPermissions = async () => {
      const newCameraPermission = await Camera.requestCameraPermission()
      setCameraPermission(newCameraPermission)
    }

    if (cameraPermission == 'not-determined') requestPermissions()
  }, [cameraPermission])

  if (cameraPermission != 'authorized' || device == null) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <View style={{ ...styles.transparentView, top: 0 }} />
      <View style={{ ...styles.transparentView, bottom: 0 }}>
        <FAB
          style={styles.fab}
          small
          icon='camera-flip-outline'
          onPress={() => {
            if (device == devices.front) {
              setDevice(devices.back)
            } else {
              setDevice(devices.front)
            }
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: windowWidth,
    height: 0.5 * windowHeight,
  },
  transparentView: {
    width: windowWidth,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
    color: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
})
