/**
 * Global News
 *
 * News
 *
 * @author       Shanindu Rajapaksha
 * @version      0.0.1 2020-May-17
 */
import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	View,
	FlatList,
	Text,
	ActivityIndicator
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import styles from './style';
import axios from 'axios';
import {SearchBar, Chip, Article} from '../../components';
import { Colors, Constants } from '../../util';

const News = props => {
	const isFocused = useIsFocused();
	const [ fetchingData, setFetchingData ] = useState(true);
	const [ data, setData ] = useState([]);
	const [ filteredData, setFilteredData ] = useState([]);
	const [ isSearch, setIsSearch ] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [selectedSource, setSelectedSource] = useState('');

	const [ isBitcoinSelected, setIsBitcoinSelected ] = useState(false);
	const [ isAppleSelected, setIsAppleSelected ] = useState(false);
	const [ isEarthquakeSelected, setIsEarthquakeSelected ] = useState(false);
	const [ isAnimalSelected, setIsAnimalSelected ] = useState(false);

	const onClickBitcoin = () => {
		fetchData('bitcoin');
		setSelectedSource('bitcoin');
		setIsBitcoinSelected(true);
		setIsAppleSelected(false);
		setIsEarthquakeSelected(false);
		setIsAnimalSelected(false);
	};

	const onClickApple = () => {
		fetchData('apple');
		setSelectedSource('apple');
		setIsBitcoinSelected(false);
		setIsAppleSelected(true);
		setIsEarthquakeSelected(false);
		setIsAnimalSelected(false);
	};

	const onClickEarthquake = () => {
		fetchData('earthquake');
		setSelectedSource('earthquake');
		setIsBitcoinSelected(false);
		setIsAppleSelected(false);
		setIsEarthquakeSelected(true);
		setIsAnimalSelected(false);
	};

	const onClickAnimal = () => {
		fetchData('animal');
		setSelectedSource('animal');
		setIsBitcoinSelected(false);
		setIsAppleSelected(false);
		setIsEarthquakeSelected(false);
		setIsAnimalSelected(true);
	};

	const fetchData = (source) => {
		setIsSearch(false);
		setIsUpdating(true);
		setData([]);
		setFilteredData([]);
		setFetchingData(true);
		axios.get(Constants.BASE_URL + 'everything', {
			params: {
				q: source,
				apiKey: Constants.API_KEY
			}
		})
			.then(response => {
				console.log(response.data.articles);
				setData(response.data.articles);
			})
			.catch(error => {
				console.log(error);
			})
			.finally(() => {
				setFetchingData(false);
				setIsUpdating(false);
			});
	};

	const searchNews = (text) => {
		if ('' === text){
			setIsSearch(false);
		} else {
			setIsSearch(true);
			setFilteredData([]);
			const filteredNews = data.filter(item => item.title.toLowerCase().includes(text.toLowerCase()));
			setFilteredData(filteredNews);
		}
	};

	useEffect(() => {
		onClickBitcoin();
	}, [isFocused]);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>News</Text>
			<View style={styles.chipContainer}>
				<Chip onPress={() => onClickBitcoin()} isBitcoinSelected={isBitcoinSelected} text={'Bitcoin'}/>
				<Chip onPress={() => onClickApple()} isBitcoinSelected={isAppleSelected} text={'Apple'}/>
				<Chip onPress={() => onClickEarthquake()} isBitcoinSelected={isEarthquakeSelected} text={'Earthquake'}/>
				<Chip onPress={() => onClickAnimal()} isBitcoinSelected={isAnimalSelected} text={'Animal'}/>
			</View>
			<SearchBar onTextChange={text => searchNews(text)}/>
			{(!fetchingData && data && (0 === data.length))
				? (
					<View style={{ alignItems: 'center', top: '38%' }}>
						<Text>Looks like there are no articles...</Text>
						<Text>Pull down to refresh</Text>
					</View>
				)
				: null
			}
			{(fetchingData && data)
				? <ActivityIndicator color={Colors.primaryColor} size={'large'} style={styles.activityIndicator} />
				:
				<FlatList
					data={isSearch ? filteredData : data}
					onRefresh={() => fetchData(selectedSource)}
					refreshing={isUpdating}
					renderItem={({ item }) => <Article item={item} navigation={props.navigation}/>}
					keyExtractor={item => item.id}
					// ListEmptyComponent={<EmptyList/>}
				/>
			}
		</SafeAreaView>
	);

};

export default News;
