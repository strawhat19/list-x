import { colors, Text, View } from '@/components/theme/Themed';
import { defaultUser, SharedContext } from '@/shared/shared';
import { SliderModes } from '@/shared/types/types';
import { hapticFeedback, web } from '@/shared/variables';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Column from '../column/column';
import SliderPagination from './pagination/pagination';

export default function Slider({ backgroundColor = colors.transparent }: any) {
    const swiping = useRef(false);
    const carouselRef = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    let { 
        user,
        width, 
        height,
        setUser,
        selected,
        progress, 
        fadeAnim, 
        updateUser,
        slideIndex, 
        boardColumns,
        setSlideIndex,
        sliderModeParallax, 
        setSliderModeParallax,
    } = useContext<any>(SharedContext);

    useEffect(() => {
        console.log(`from slider`, {setUser, updateUser});
        if (setUser) {
            setUser(defaultUser);
        }
    }, [])

    const columnRefs = useMemo(() => {
        if (boardColumns && Array.isArray(boardColumns)) {
            return boardColumns.reduce((acc: any, col: any) => {
                acc[col.id] = React.createRef();
                return acc;
            }, {});
        }
    }, [boardColumns]);      

    useDerivedValue(() => {
        if (progress && progress.value) {
            const absoluteProgress = progress.value;
            runOnJS(setSlideIndex)(absoluteProgress);
        }
    }, [progress])

    const onBoardRowPress = () => {
        setSliderModeParallax(!sliderModeParallax);
        hapticFeedback();
    }

    const swipeCarousel = (translationX: any) => {
        if (selected == null && !swiping.current) {
            swiping.current = true;
            carouselRef.current?.scrollTo({
                count: translationX > 0 ? -1 : 1,
                animated: true,
            });
            setTimeout(() => {
                swiping.current = false;
            }, 0);
        }
    }

    return (
        web() ? (
            <div>Hello</div>
        ) : user == null ? <>
            <Text>
                User is Null
            </Text>
        </> : 
        <>
            {selected == null && (
                <View style={{ width: `100%`, backgroundColor: colors.mainBG, justifyContent: `center`, alignItems: `center`, paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => onBoardRowPress()} style={{ width: `100%`, backgroundColor: colors.mainBG, justifyContent: `center`, alignItems: `center`, paddingVertical: 5, }}>
                        <Text style={{ fontSize: 22, fontStyle: `italic`, fontWeight: `bold`, color: colors.white }}>
                            Board
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <Carousel
                width={width}
                height={height}
                ref={carouselRef}
                data={boardColumns}
                enabled={selected == null}
                onProgressChange={progress}
                loop={boardColumns?.length > 1}
                pagingEnabled={selected == null}
                containerStyle={{ backgroundColor }}
                style={{ backgroundColor: colors.mainBG, }}
                defaultScrollOffsetValue={scrollOffsetValue}
                mode={sliderModeParallax == true ? SliderModes.Parallax : undefined}
                modeConfig={{ parallaxScrollingScale: 0.99, parallaxAdjacentItemScale: 0.55 }}
                renderItem={({ index, item: column }: any) => (
                    <Column
                        key={index}
                        column={column}
                        height={height}
                        fadeAnim={fadeAnim}
                        columnRefs={columnRefs}
                        carouselRef={carouselRef}
                        swipeCarousel={swipeCarousel}
                        columnRef={columnRefs[column.id]}
                        active={(slideIndex + 1) == column.index}
                    />
                )}
            />

            <SliderPagination carouselRef={carouselRef} />
        </> 
    )
}