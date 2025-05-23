import { BsArrowRight } from 'react-icons/bs'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

const summaryCard = () => {

    const router = useRouter()

    return (
        <>
            <form className="my-4" key={v.oid}>
                <div
                    className="d-flex justify-content-center"
                    role="button"
                    tabIndex={0}
                    onClick={handleItemClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            router.push(`../../cart/${v.oid}`)
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="direction-column">
                        <div
                            className="card border-primary"
                            style={{ width: '40rem' }}
                        >
                            <div
                                className="card-header card-big-title border border-0"
                                style={{ backgroundColor: 'transparent ' }}
                            >
                                訂單編號：{v.oid}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title font-grey-title mb-2">
                                    訂單成立時間：
                                    {dayjs(v.order_date).format('YYYY-MM-DD HH:mm:ss')}
                                </h5>
                                <h5 className="card-title font-grey-title mb-2 ">
                                    付款方式：{v.pay_way}
                                </h5>
                                <h5 className="card-title font-grey-title mb-2 text-info">
                                    付款情況：
                                    {v.order_status === 1
                                        ? '已付款'
                                        : v.order_status === 0
                                            ? '未付款'
                                            : ''}
                                </h5>
                                <h5 className="card-title font-grey-title mb-2">
                                    交貨方式：{v.delivery_way}
                                </h5>
                                <h5 className="card-title font-grey-title mb-2 text-success">
                                    處理情況：{v.delivery_status}
                                </h5>
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title font-grey-title mb-2 text-danger">
                                        總金額：NT$ {v.total}
                                    </h5>
                                    <h5>
                                        See more <BsArrowRight />
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}


export default summaryCard
