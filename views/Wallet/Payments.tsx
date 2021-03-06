import * as React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import Payment from './../../models/Payment';
import { inject, observer } from 'mobx-react';

import PaymentsStore from './../../stores/PaymentsStore';
import UnitsStore from './../../stores/UnitsStore';

const RemoveBalance = require('./../../images/lightning-red.png');

interface PaymentsProps {
    navigation: any;
    payments: Array<Payment>;
    refresh: any;
    PaymentsStore: PaymentsStore;
    UnitsStore: UnitsStore;
}

@inject('UnitsStore')
@observer
export default class PaymentsView extends React.Component<PaymentsProps, {}> {
    renderSeparator = () => <View style={styles.separator} />;

    render() {
        const { payments, navigation, refresh, PaymentsStore, UnitsStore } = this.props;
        const { getAmount, units } = UnitsStore;
        const { loading } = PaymentsStore;
        return (
            <View style={{ flex: 1 }}>
                {(!!payments && payments.length > 0) || loading  ? <FlatList
                    data={payments}
                    renderItem={({ item }: any) => {
                        const date = new Date(Number(item.creation_date) * 1000).toString();
                        return (
                            <ListItem
                                key={item.payment_hash}
                                title={units && getAmount(item.value)}
                                subtitle={date}
                                containerStyle={{ borderBottomWidth: 0 }}
                                avatar={RemoveBalance}
                                onPress={() => navigation.navigate('Payment', { payment: item })}
                            />
                        );
                    }}
                    keyExtractor={item => item.payment_hash}
                    ItemSeparatorComponent={this.renderSeparator}
                    onEndReachedThreshold={50}
                    refreshing={loading}
                    onRefresh={() => refresh()}
                /> : <Button
                    title="No Payments"
                    icon={{
                        name: "error-outline",
                        size: 25,
                        color: "black"
                    }}
                    backgroundColor="transparent"
                    color="black"
                    onPress={() => refresh()}
                    borderRadius={30}
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
    }
});