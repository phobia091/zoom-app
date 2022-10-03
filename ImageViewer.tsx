
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    StatusBar,
    BackHandler,
    StyleSheet,
    ViewStyle,
    ScrollView, Dimensions, ImageStyle, ImageResizeMode
} from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

let imageWidth = width;
let imageHeight = imageWidth * 0.7;


interface Props {
    images: any,
    style?: ViewStyle,
    containerStyle?: ViewStyle,
    renderCustomComponent?: (item: any, index: number) => Function
}


interface ItemImageProps {
    url: string,
    index: number,
    resizeMode?: ImageResizeMode,
    onZoomAfter?: (event, gestureState, zoomableViewEventObject) => void,
    onDoubleTapAfter?: (event, gestureState, zoomableViewEventObject) => void,
    imageStyle?: ImageStyle,
    containerStyle?: ViewStyle,
    canZoom?: boolean
}


const ItemImage = memo((props: ItemImageProps) => {
    const {
        onDoubleTapAfter,
        onZoomAfter,
        imageStyle,
        containerStyle,
        resizeMode,
        url,
        index
    } = props;

    const onZoomAfterCB = useCallback((event, gestureState, zoomableViewEventObject) => {
      onZoomAfter && onZoomAfter(event, gestureState, zoomableViewEventObject, index)
    }, [onZoomAfter, index])


    const onDoubleTapAfterCB = useCallback((event, gestureState, zoomableViewEventObject) => {
      onZoomAfter && onZoomAfter(event, gestureState, zoomableViewEventObject, index)
    }, [onDoubleTapAfter, index])


    return (
        <ReactNativeZoomableView
            zoomEnabled={true}
            maxZoom={1.5}
            minZoom={1}
            zoomStep={1.5}
            initialZoom={1}
            bindToBorders={true}
            onZoomAfter={onZoomAfterCB}
            onDoubleTapAfter={onDoubleTapAfterCB}
            style={[styles.zoomableView, containerStyle]}
        >
            <Image
                style={[styles.image, imageStyle]}
                source={{uri: url}}
                resizeMode={resizeMode || "contain"}
            />
        </ReactNativeZoomableView>
    )
});
const ImageViewer = (props: Props) => {
    const {images, renderCustomComponent} = props;
    const [zooming, setZooming] = useState(false);
    const logOutZoomState = _.debounce((event, gestureState, zoomableViewEventObject, index) => {
        if (zoomableViewEventObject.zoomLevel !== 1) {
            setZooming(true)
            console.log('index ', index) 
            this.swiper.scrollBy(index, true)
        } else {
            setZooming(false)
        }
    }, 200);

    return (
        <View style={styles.container}>
            <Swiper
                loadMinimal={true}
                loadMinimalSize={2}
                autoplayDelay={2000}
                ref={ref => this.swiper = ref}
                loop={false}
                autoplay={false}
                scrollEnabled={!zooming}
                showsPagination={true}
                activeDotColor={'#ffffff'}
                paginationStyle={{
                    position: 'absolute',
                    bottom: 12,
                    left: 0,
                    right: 0
                }}
                dot={<View style={{
                    backgroundColor: '#eeeeee',
                    opacity: 0.1,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                }}/>}
                activeDot={
                    <View style={{
                        backgroundColor: '#ffffff',
                        opacity: 0.5,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                    }}/>
                }>
                {
                    images.map((_image, index) => {
                        return (
                            <View style={styles.zoomWrapper}>
                                <ItemImage index={index} onZoomAfter={logOutZoomState} onDoubleTapAfter={logOutZoomState} url={_image.url || _image}/>
                                {
                                  renderCustomComponent && renderCustomComponent(_image, index)
                                }
                            </View>
                        )
                    })
                }
            </Swiper>
        </View>
    );
};

export { ImageViewer}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#5569ff',
        paddingTop: 50,
        paddingBottom: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 20,
    },
    zoomWrapper: {
        width,
        height,
        overflow: 'hidden',
    },
    zoomableView: {
        backgroundColor: 'black',
    },
    image: {
        flex: 1,
        width: '100%',
    }
});
