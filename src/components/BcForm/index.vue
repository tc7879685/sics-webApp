<template>
	<van-form
		ref="form"
		@failed="onfailed"
		:show-error-message="!isVerifyModelToast"
		:show-error="false"
		:submit-on-enter="true"
		@submit="onSubmit"
	>
		<slot
			v-for="item in formConfigList"
			:key="item.key"
			:name="item.key"
			:row="item"
		>
			<van-field
				v-if="item.componentType == 'select'"
				v-model="formModels[item.key]"
				:name="item.key"
				:label="item.label"
				:placeholder="item.placeholder"
				:rules="item.rules"
				is-link
				readonly
				@click="showPopupHandler(item)"
			/>
			<van-field
				v-else-if="item.componentType == 'calendar'"
				v-model="formModels[item.key]"
				:name="item.key"
				:label="item.label"
				:placeholder="item.placeholder"
				:rules="item.rules"
				is-link
				readonly
				@click="showPopupHandler(item)"
			/>
			<van-field
				v-else-if="item.componentType == 'uploader'"
				:name="item.key"
				:label="item.label"
				:value="formModels[item.key] + ''"
				:rules="item.rules"
			>
				<template #input>
					<van-uploader
						v-model="formModels[item.key]"
						:accept="item.accept || 'image/*'"
						:multiple="item.multiple || false"
						:max-count="item.maxCount || 1"
						preview-full-image
						:after-read="afterRead(item)"
						:preview-size="item.previewSize || 80"
					/>
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'switch'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-switch v-model="formModels[item.key]" />
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'checkbox'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-checkbox-group
						v-model="formModels[item.key]"
						:direction="item.direction || 'horizontal'"
					>
						<van-checkbox
							v-for="opt in item.options"
							:name="opt.value"
							:key="opt.value"
							:shape="item.shape || 'square'"
						>
							{{ opt.label }}
						</van-checkbox>
					</van-checkbox-group>
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'radio'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-radio-group
						v-model="formModels[item.key]"
						:direction="item.direction || 'horizontal'"
					>
						<van-radio
							v-for="opt in item.options"
							:name="opt.value"
							:key="opt.value"
						>
							{{ opt.label }}
						</van-radio>
					</van-radio-group>
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'stepper'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-stepper v-model="formModels[item.key]" />
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'rate'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-rate v-model="formModels[item.key]" />
				</template>
			</van-field>
			<van-field
				v-else-if="item.componentType == 'slider'"
				:name="item.key"
				:label="item.label"
				:rules="item.rules"
			>
				<template #input>
					<van-slider v-model="formModels[item.key]" />
				</template>
			</van-field>
      <!--???????????????-->
			<template v-else-if="item.componentType == 'sms'">
				<van-field
					v-model="formModels[item.key]"
					:name="item.key"
					:type="item.type as any"
					:maxlength="item.maxlength"
					clearable
					:label="item.label"
					:placeholder="item.placeholder"
					:rules="item.rules"
					@input="formatter(item.key, item.formatter)"
				>
					<template #button>
						<van-button
							:disabled="
								countDownData.smSconfig.cumulative < countDownData.CUMULATIVE
							"
							size="small"
							type="primary"
							@click="handlerCountdown(item, countDownData.countdown)"
						>
							{{ countDownData.smSconfig.smsText }}
						</van-button>
					</template>
				</van-field>
			</template>
      <!--???????????????-->
      <template v-else-if="item.componentType == 'captcha'">
        <van-field
            v-model="formModels[item.key]"
            :name="item.key"
            :type="item.type as any"
            :maxlength="item.maxlength"
            clearable
            :label="item.label"
            :placeholder="item.placeholder"
            :rules="item.rules"
            @input="formatter(item.key, item.formatter)"
        >
          <template #button>
            <van-image
                :disabled="
								countDownData.smSconfig.cumulative < countDownData.CUMULATIVE
							"
                :src="item.src"
                size="small"
                type="primary"
                @click="handlerCountdown(item, countDownData.countdown)"
            >
              {{ countDownData.smSconfig.smsText }}
            </van-image>
          </template>
        </van-field>
      </template>
			<van-field
				v-else
				v-model="formModels[item.key]"
				:name="item.key"
				:type="item.type as any"
				:maxlength="item.maxlength"
				clearable
				:label="item.label"
				:placeholder="item.placeholder"
				:rules="item.rules"
				@input="formatter(item.key, item.formatter)"
			/>
		</slot>
		<div class="py-4 spacing-base-x">
			<van-button
				:loading="loading"
				round
				block
				type="primary"
				native-type="submit"
				loading-text="?????????..."
			>
        {{buttonLabel}}
			</van-button>
		</div>
		<van-calendar
			:type="formModel.type"
			:min-date="formModel.minDate"
			:max-date="formModel.maxDate"
			v-model:show="calendarVisible"
			@confirm="onConfirm"
			@cancel="calendarVisible = false"
		/>

		<van-popup v-model:show="selectorVisible" position="bottom">
			<van-picker
				v-if="formModel.componentType == 'select'"
				:columns="columns"
				@confirm="onConfirm"
				@cancel="selectorVisible = false"
			/>
		</van-popup>
	</van-form>
</template>
<script lang="ts">
	import {
		defineComponent,
		nextTick,
		reactive,
		ref,
		getCurrentInstance,
	} from 'vue';
	import { Toast } from 'vant';
	import { useCountDown } from '@/hooks/index';
	import { dateFormat as dateFormats } from '@fe-hl/utils';

	type OptionsType = {
		label: string;
		value: string | number;
		text: string | number;
	};

	type FormConfigType = {
		componentType:
			| 'text'
			| 'sms'
			| 'switch'
			| 'checkbox'
			| 'radio'
			| 'stepper'
			| 'rate'
			| 'slider'
			| 'select'
			| 'calendar'
      | 'captcha'
			| 'uploader';
		key: string;
		type?: 'tel' | 'text' | 'password' | 'range' | 'single' | '';
		label?: string;
		placeholder?: string;
		maxlength?: number;
		beforeValidateKey?: Array<string>;
		rules?: Array<object>;
		direction: 'horizontal' | 'vertical';
		shape: 'square' | 'round';
		dateFormat?: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss';
		minDate?: Date;
		maxDate?: Date;
		maxCount?: number;
		accept?: string;
		multiple?: boolean;
		previewSize?: number;
    src?:string;
		options?: Array<OptionsType>;
		formatter?: (str: string) => string;
		beforeRead?: (file: Blob) => boolean;
		confirmCallback?: (
			optionValue: string | number,
			optionData: OptionsType,
			formModels: object
		) => void;
		handlerCountdown?: (countdown: () => void, formModel: object) => void;
	};

	import type { PropType } from 'vue';

	export default defineComponent({
		name: 'BcForm',
		props: {
			// ????????????
			formConfigList: {
				type: Array as PropType<Array<FormConfigType>>,
				required: true,
			},
			// ????????????
			handlerUpload: {
				type: Function as PropType<
					(formConfig: FormConfigType, file: Blob) => Promise<any>
				>,
			},
			// ????????????
			handlerSubmit: {
				type: Function as PropType<(formModels: object) => Promise<any>>,
				required: true,
			},
			// ???????????????????????????Toast????????????
			isVerifyModelToast: {
				type: Boolean,
				default: true,
			},
      //????????????
      buttonLabel: {
        type: String,
        default: "??????",
      }
		},
		setup(ctx: any) {
			let Instance: any = getCurrentInstance()?.proxy;
			// ????????????
			let formModels = reactive({});
			// ?????????????????????
			let selectorVisible = ref(false);
			// ??????????????????
			let columns = ref([]);
			// ??????????????????
			let calendarVisible = ref(false);
			// ???????????????form
			let formModel = ref<any>({});

			let loading = ref(false);

			let init = () => {
				ctx.formConfigList.forEach(item => {
					item.type = '';
					// ?????????
					if (item.componentType === 'switch') {
						formModels[item.key] =
							typeof item.defaultValue === 'undefined'
								? false
								: item.defaultValue;
					} else if (item.componentType === 'radio') {
						nextTick(() => {
							formModels[item.key] =
								typeof item.defaultValue === 'undefined'
									? ''
									: item.defaultValue;
						});
					} else if (item.componentType === 'rate') {
						formModels[item.key] =
							typeof item.defaultValue === 'undefined' ? 0 : item.defaultValue;
					} else if (item.componentType === 'uploader') {
						formModels[item.key] =
							typeof item.defaultValue === 'undefined' ? [] : item.defaultValue;
					} else {
						formModels[item.key] = item.defaultValue;
					}
				});
			};
			init();

			// ??????????????? or ??????
			const showPopupHandler = formConfig => {
				formModel.value = formConfig;
				switch (formConfig.componentType) {
					case 'select': // ?????????
						selectorVisible.value = true;
						// ?????????????????????
						columns.value = formConfig.options.map(item => {
							return {
								text: item.label,
								...item,
							};
						});
						break;
					case 'calendar': // ??????
						calendarVisible.value = true;
						break;
					default:
						break;
				}
			};

			// ?????? or ?????????????????????
			const onConfirm = payload => {
				selectorVisible.value = false;
				calendarVisible.value = false;
				let { componentType, key, confirmCallback, dateFormat } =
					formModel.value as any;
				if (componentType === 'calendar') {
					dateFormat = dateFormat || 'YYYY-MM-DD';
					let dateStr;
					if (Array.isArray(payload)) {
						const [start, end] = payload;
						dateStr = `${dateFormats(start, dateFormat)} / ${dateFormats(
							end,
							dateFormat
						)}`;
					} else {
						dateStr = dateFormats(payload, dateFormat);
					}
					formModels[key] = dateStr;
				} else {
					formModels[key] = payload.value;
				}
				confirmCallback && confirmCallback(payload.value, payload, formModels);
			};
			// ???????????????
			let countDownData = useCountDown();
			let handlerCountdown = async (formConfig, countdown) => {
				if (countDownData.smSconfig.cumulative !== countDownData.CUMULATIVE) {
					return Toast('??????????????????????????????');
				}
				try {
					await Instance.$refs['form'].validate(formConfig.beforeValidateKey);
					formConfig.handlerCountdown(countdown);
				} catch (error: any) {
					if (ctx.isVerifyModelToast) {
						Toast(error[0].message);
					}
				}
			};

			// ????????????
			let formatter = (key, callback) => {
				if (callback) {
					formModels[key] = callback(formModels[key]);
				}
			};

			// ??????tip
			const onfailed = errors => {
				if (ctx.isVerifyModelToast) {
					Toast(errors.errors[0].message);
				}
			};

			const afterRead = formConfig => {
				return async file => {
					if (formConfig.beforeRead) {
						let flags = formConfig.beforeRead(file);
						if (!flags) {
							return;
						}
					}
					file.status = 'uploading';
					file.message = '?????????...';
					try {
						let fileUrls = await ctx.handlerUpload(formConfig, file.file);
						fileUrls = fileUrls.map(url => {
							return {
								url,
							};
						});

						formModels[formConfig.key] = [
							...formModels[formConfig.key],
							...fileUrls,
						].filter(item => !item.status);
						file.status = 'done';
						file.message = '????????????';
					} catch (error) {
						file.status = 'failed';
						file.message = '??????????????????????????????';
					}
				};
			};

			const onSubmit = async values => {
				loading.value = true;
				let params = {};
				Object.keys(values).forEach(key => {
					if (
						values[key] !== '' &&
						values[key] !== 'null' &&
						values[key] !== 'undefined' &&
						values[key] !== null &&
						values[key] !== undefined
					) {
						params[key] = values[key];
					}
				});
				try {
					await ctx.handlerSubmit(params);
				} catch (error) {
					console.log(error);
				} finally {
					loading.value = false;
				}
			};

			return {
				countDownData,
				formModels,
				formatter,
				handlerCountdown,
				selectorVisible,
				calendarVisible,
				loading,
				onfailed,
				onSubmit,
				onConfirm,
				formModel,
				afterRead,
				columns,
				showPopupHandler,
			};
		},
	});
</script>
<style lang="scss" scoped></style>
