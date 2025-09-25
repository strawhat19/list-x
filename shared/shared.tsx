import SlideUp from '@/components/slide-up/slide-up';
import { colors, View } from '@/components/theme/Themed';
import { BoardType, ColumnType, ItemType, ItemViews, TaskType, Views } from '@/shared/types/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, useWindowDimensions } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel, useSharedValue } from 'react-native-reanimated';
import { defaultColumns } from './database';
import { roles, User } from './models/User';
import { db, itemsDatabaseCollection, tasksDatabaseCollection } from './server/firebase';
import { animationOptions, devEnv, log, logMsgLine, useDatabase, web } from './variables';

configureReanimatedLogger({ strict: false, level: ReanimatedLogLevel.error });

export const SharedContext = createContext({});

export const defaultItemView = ItemViews.Tasks;
export const defaultUser = devEnv ? { id: `User_1`, uid: `User_1`, name: `Default`, role: roles.Owner.name, level: roles.Owner.level } : {
  "id": "User_1_8-47-PM_9-24-2025_vBK5XSeH6",
  "index": 1,
  "uuid": "vBK5XSeH6",
  "email": "r",
  "name": "R",
  "created": "9/24/2025, 8:47:20 PM",
  "updated": "9/24/2025, 8:47:20 PM",
  "password": "r",
  "boardIDs": [],
  "type": "Real",
  "level": 2,
  "role": "Subscriber",
  "provider": "Firebase",
  "title": "User 1 8:47 PM 9-24-2025 vBK5XSeH6",
  "uid": "vBK5XSeH6"
};

export default function Shared({ children }: { children: React.ReactNode; }) {
  const router = useRouter();

  let [indx, setIndx] = useState(0);
  let [beta, setBeta] = useState(false);
  let [blur, setBlur] = useState<any>(100);
  let [editing, setEditing] = useState(false);
  let [slideIndex, setSlideIndex] = useState(0);
  let [modalOpen, setModalOpen] = useState(false);
  let [isDragging, setDragging] = useState(false);
  let [items, setItems] = useState<ItemType[]>([]);
  let [tasks, setTasks] = useState<TaskType[]>([]);
  let [userLoading, setUserLoading] = useState(true);
  let [boards, setBoards] = useState<BoardType[]>([]);
  let [users, setUsers] = useState<User[] | null>([]);
  let [itemsLoading, setItemsLoading] = useState(true);
  let [usersLoading, setUsersLoading] = useState(true);
  let [tasksLoading, setTasksLoading] = useState(true);
  let [board, setBoard] = useState<BoardType | null>(null);
  let [colorPickerOpen, setColorPickerOpen] = useState(false);
  let [user, setUser] = useState<User | null | any>(defaultUser);
  let [selectedColor, setSelectedColor] = useState(colors.listsBG);
  let [sliderModeParallax, setSliderModeParallax] = useState(false);
  let [view, setView] = useState<ItemViews | Views>(defaultItemView);
  let [boardColumns, setBoardColumns] = useState<BoardType | ColumnType[]>(defaultColumns);
  let [activeTopName, setActiveTopName] = useState<any>(defaultColumns[slideIndex]?.name);
  let [selected, setSelected] = useState<BoardType | ColumnType | ItemType | null>(null);

  const progress = useSharedValue<number>(0);
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const blurBGContainerOpacity = useRef(new Animated.Value(0)).current;

  const updateUser = (usr: any) => {
    setUser(usr);
  }

  const closeBottomSheet = (dismissKeyboard = false) => {
    setIndx(0);
    exitFadeBlur();
    setEditing(false);
    setSelected(null);
    setView(defaultItemView);
    setSelectedColor(colors.listsBG);
    if (dismissKeyboard) Keyboard.dismiss();
  }

  const onSheetChange = (index?: any) => {
    if (index === 0) {
      setActiveTopName(defaultColumns[slideIndex]?.name);
      closeBottomSheet();
    }
  }

  const openBottomSheet = (item?: any, backgroundColor?: any) => {
    enterFadeBlur();
    setIndx(1);
    if (item) {
      logMsgLine(`Opened Details for ${item?.type} that says "${item?.name}"`);
      if (item.name) setActiveTopName(item.name);
      if (backgroundColor) {
        item = {
          ...item,
          backgroundColor,
        }
      }
      setSelected(item);
      setSelectedColor(item?.backgroundColor);
    }
    // Vibration.vibrate(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  const enterFadeBlur = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      ...animationOptions,
    }).start();
    
    Animated.timing(blurBGContainerOpacity, {
      toValue: 1,
      ...animationOptions,
    }).start();
  }

  const exitFadeBlur = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      ...animationOptions,
    }).start();

    Animated.timing(blurBGContainerOpacity, {
      toValue: 0,
      ...animationOptions,
    }).start();
  }

  useEffect(() => {
    console.log(`from shared`, {setUser});
    setUser(defaultUser);
  }, [])

  useEffect(() => {    
    if (useDatabase && user != null) {
      router.replace(`/(tabs)`);
      if (setUserLoading != undefined) setUserLoading(false);

      const itemsCollection = collection(db, itemsDatabaseCollection);
      const unsubscribeFromItemsDatabase = onSnapshot(itemsCollection, snapshot => {
          setItemsLoading(true);
          let itemsFromDB: any[] = [];
          snapshot.forEach((doc) => itemsFromDB.push({ ...doc.data() } as any));
          itemsFromDB = itemsFromDB.sort((a, b) => a?.index - b?.index);
          setItems(itemsFromDB);
          if (itemsFromDB.length > 0 && selected != null) {
            let selectedItem = itemsFromDB?.find(itm => itm?.id == selected?.id);
            if (selectedItem) {
              setSelected(selectedItem);
            }
          }
          setItemsLoading(false);
          logMsgLine(`${itemsFromDB.length} Item(s) from Database`);
        }, error => {
          setItemsLoading(false);
          log(`Error on Get Item(s) from Database`, error);
        }
      )
      
      const tasksCollection = collection(db, tasksDatabaseCollection);
      const unsubscribeFromTasksDatabase = onSnapshot(tasksCollection, snapshot => {
          setTasksLoading(true);
          let tasksFromDB: any[] = [];
          snapshot.forEach((doc) => tasksFromDB.push({ ...doc.data() } as any));
          tasksFromDB = tasksFromDB.sort((a, b) => a?.index - b?.index);
          setTasks(tasksFromDB);
          setTasksLoading(false);
          logMsgLine(`${tasksFromDB.length} Task(s) from Database`);
        }, error => {
          setTasksLoading(false);
          log(`Error on Get Task(s) from Database`, error);
        }
      )

      return () => {
        unsubscribeFromItemsDatabase();
        unsubscribeFromTasksDatabase();
      }
    }
  }, [user])

  return (
    <SharedContext.Provider 
      value={{ // Globally Shared State Data
        width,
        progress,
        fadeAnim,
        updateUser,
        exitFadeBlur,
        view, setView,
        enterFadeBlur,
        user, setUser, 
        beta, setBeta, 
        indx, setIndx,
        blur, setBlur,
        onSheetChange,
        users, setUsers,
        board, setBoard,
        items, setItems,
        tasks, setTasks,
        openBottomSheet,
        closeBottomSheet,
        boards, setBoards,
        height: height - 35,
        editing, setEditing,
        selected, setSelected,
        blurBGContainerOpacity,
        isDragging, setDragging,
        modalOpen, setModalOpen,
        slideIndex, setSlideIndex,
        userLoading, setUserLoading,
        boardColumns, setBoardColumns,
        tasksLoading, setTasksLoading,
        itemsLoading, setItemsLoading,
        usersLoading, setUsersLoading,
        activeTopName, setActiveTopName,
        selectedColor, setSelectedColor,
        colorPickerOpen, setColorPickerOpen,
        sliderModeParallax, setSliderModeParallax,
      }}
    >
      {web() ? (
        <div style={{ flex: 1, width: `100%` }}>
          {children}
          {/* <SlideUp /> */}
        </div>
      ) : (
        <GestureHandlerRootView>
          <View style={{ flex: 1, width: `100%` }}>
            {children}
            <SlideUp />
          </View>
        </GestureHandlerRootView>
      )}
    </SharedContext.Provider>
  )
}