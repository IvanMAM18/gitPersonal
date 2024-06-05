import React, { useRef } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Upload,
    message,
    Button,
    DatePicker,
    Tooltip,
    Tag,
    InputNumber,
    Checkbox,
    Cascader,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/es_ES";

const { TextArea } = Input;
const { Option } = Select;

const ModalForm = ({
    visible,
    onCreate,
    onCancel,
    formData,
    title,
    tags_edit = [],
    showTags = false,
}) => {
    const [form] = Form.useForm();
    const tags_group = useRef();

    if (!!tags_group.current)
        tags_group.current.state.tags = ["Añade una etiqueta", ...tags_edit];

    let image_error = false;
    let date_input_name = [],
        year_input_name = "",
        month_input_name = "";

    if (formData.length !== 0) {
        let formValues = {};
        if (formData[0].value !== "") {
            formData.forEach((fi) => {
                switch (fi.type) {
                    case "date":
                        formValues[fi.name] = moment(fi.value);
                        date_input_name.push(fi.name);
                        break;
                    case "year":
                        formValues[fi.name] = moment(fi.value);
                        year_input_name = fi.name;
                        break;
                    case "month":
                        formValues[fi.name] = moment(fi.value);
                        month_input_name = fi.name;
                        break;
                    case "multiselect":
                        const mSelectValues = fi.value.map(
                            (_value) => _value.id
                        );
                        formValues[fi.name] = mSelectValues;
                        break;
                    default:
                        formValues[fi.name] = fi.value;
                        break;
                }
            });
        } else {
            formData.forEach((fi) => {
                switch (fi.type) {
                    case "date":
                        date_input_name.push(fi.name);
                        break;
                    case "year":
                        year_input_name = fi.name;
                        break;
                    case "month":
                        month_input_name = fi.name;
                        break;
                    case "multiselect":
                        formValues[fi.name] = [];
                        break;
                    case "checkbox":
                        formValues[fi.name] = false;
                        break;
                    default:
                        formValues[fi.name] = "";
                        break;
                }
            });
        }
        form.setFieldsValue(formValues);
    }

    const onSelectChange = (value, key, type, objectName) => {
        if (type === "multiselect")
            form.setFieldsValue({ [objectName]: value });
        else form.setFieldsValue({ [objectName]: value });
    };

    const normImage = (e) => {
        e.file.status = "done";
        if (image_error === true) {
            e.fileList = [];
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const normFile = (e) => {
        e.file.status = "done";
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    return (
        <Modal
            open={visible}
            title={title}
            okText="Enviar"
            cancelText="Canelar"
            onCancel={() => {
                onCancel();
            }}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        if (date_input_name.length !== 0) {
                            date_input_name.map((din) => {
                                values[din] = values[din].format("YYYY-MM-DD");
                            });
                        }

                        if (year_input_name !== "")
                            values[year_input_name] =
                                values[year_input_name].year(); //format('YYYY-MM-DD');

                        if (month_input_name !== "")
                            values[month_input_name] =
                                values[month_input_name].month(); //.format('YYYY-MM-DD').month();

                        form.resetFields();
                        if (showTags) {
                            onCreate(values, tags_group.current.state.tags);
                        }
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                {formData.map((formDataItem) => {
                    if (formDataItem.type === "cascader") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                hidden={formDataItem.hidden}
                                key={formDataItem?.name}
                            >
                                <Cascader
                                    options={formDataItem.info}
                                    placeholder={
                                        "Seleccione un departamento y una entidad revisora"
                                    }
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "input") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                hidden={formDataItem.hidden}
                            >
                                <Input disabled={formDataItem.disabled} />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "checkbox") {
                        return (
                            <Form.Item
                                valuePropName="checked"
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                hidden={formDataItem.hidden}
                            >
                                <Checkbox disabled={formDataItem.disabled} />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "numeric") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                hidden={formDataItem.hidden}
                            >
                                <InputNumber disabled={formDataItem.disabled} />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "inputpassword") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                hasFeedback
                            >
                                <Input.Password
                                    placeholder="Ingrese una contraseña, minimo 8 caracteres"
                                    disabled={formDataItem.disabled}
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "inputpasswordconfirm") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                hasFeedback
                                dependencies={["password"]}
                            >
                                <Input.Password
                                    placeholder="Ingrese una contraseña, minimo 8 caracteres"
                                    disabled={formDataItem.disabled}
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "date") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                            >
                                <DatePicker
                                    format={"YYYY-MM-DD"}
                                    locale={locale}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "year") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                            >
                                <DatePicker
                                    format={"YYYY-MM-DD"}
                                    locale={locale}
                                    style={{ width: "100%" }}
                                    picker="year"
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "month") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                            >
                                <DatePicker
                                    format={"YYYY-MM-DD"}
                                    locale={locale}
                                    style={{ width: "100%" }}
                                    picker="month"
                                />
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "textarea") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                            >
                                <TextArea
                                    showCount
                                    maxLength={500}
                                    disabled={formDataItem.disabled}
                                />
                            </Form.Item>
                        );
                    }
                    if (
                        formDataItem.type === "select" ||
                        formDataItem.type === "multiselect"
                    ) {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                            >
                                <Select
                                    mode={
                                        formDataItem.type === "multiselect"
                                            ? "multiple"
                                            : undefined
                                    }
                                    disabled={formDataItem.disabled}
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Selecciona una opción"
                                    optionFilterProp="children"
                                    onChange={(value, key) =>
                                        onSelectChange(
                                            value,
                                            key,
                                            formDataItem.type,
                                            formDataItem.name
                                        )
                                    }
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {formDataItem.options.map((option) => {
                                        return (
                                            <Option
                                                value={option.id}
                                                key={option.id}
                                            >
                                                {option.name ?? option.nombre}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "image") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                valuePropName="value"
                                getValueFromEvent={normImage}
                                extra={formDataItem.extra}
                            >
                                <Upload
                                    name={formDataItem.name}
                                    action="/"
                                    listType="picture"
                                    accept="image/*"
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        image_error = false;
                                        const _URL =
                                            window.URL || window.webkitURL;
                                        let img = new Image();
                                        img.onload = function () {
                                            if (
                                                this.width / this.height !==
                                                2
                                            ) {
                                                message.error(
                                                    "La imagen debe tener el doble de ancho que de alto!"
                                                );
                                                image_error = true;
                                                return false;
                                            }
                                        };
                                        img.src = _URL.createObjectURL(file);
                                        const isLt5kb =
                                            file.size / 1024 / 1024 < 0.5;
                                        if (!isLt5kb) {
                                            message.error(
                                                "La imagen debe pesar menos de 500kb!"
                                            );
                                            image_error = true;
                                            return false;
                                        }
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        De click para subir imagen
                                    </Button>
                                </Upload>
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "image-cs") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                valuePropName="value"
                                getValueFromEvent={normImage}
                                extra={formDataItem.extra}
                            >
                                <Upload
                                    name={formDataItem.name}
                                    action="/"
                                    listType="picture"
                                    accept="image/*"
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        image_error = false;
                                        const isLt5kb =
                                            file.size / 1024 / 1024 < 0.5;
                                        if (!isLt5kb) {
                                            message.error(
                                                "La imagen debe pesar menos de 500kb!"
                                            );
                                            image_error = true;
                                            return false;
                                        }
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        De click para subir imagen
                                    </Button>
                                </Upload>
                            </Form.Item>
                        );
                    }
                    if (formDataItem.type === "file") {
                        return (
                            <Form.Item
                                name={formDataItem.name}
                                label={formDataItem.label}
                                rules={formDataItem.rules}
                                key={formDataItem.name}
                                valuePropName="value"
                                extra={formDataItem.extra}
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name={formDataItem.name}
                                    action="/"
                                    accept=".pdf"
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        file_error = false;
                                        const isLt10kb =
                                            file.size / 1024 / 1024 < 10;
                                        console.log("isLt10kb", isLt10kb);
                                        if (!isLt10kb) {
                                            message.error(
                                                "El documento debe pesar máximo 10mb!"
                                            );
                                            file_error = true;
                                        }
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        De click para subir un documento
                                    </Button>
                                </Upload>
                            </Form.Item>
                        );
                    }
                    return null;
                })}
            </Form>
            {showTags && <EditableTagGroup tags={tags_edit} ref={tags_group} />}
        </Modal>
    );
};
class EditableTagGroup extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        tags: ["Añade una etiqueta", ...this.props.tags],
        inputVisible: false,
        inputValue: "",
        editInputIndex: -1,
        editInputValue: "",
    };
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter((tag) => tag !== removedTag);
        //console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        //console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: "",
        });
    };

    handleEditInputChange = (e) => {
        this.setState({ editInputValue: e.target.value });
    };

    handleEditInputConfirm = () => {
        this.setState(({ tags, editInputIndex, editInputValue }) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: "",
            };
        });
    };

    saveInputRef = (input) => {
        this.input = input;
    };

    saveEditInputRef = (input) => {
        this.editInput = input;
    };

    render() {
        const {
            tags,
            inputVisible,
            inputValue,
            editInputIndex,
            editInputValue,
        } = this.state;
        return (
            <>
                {tags.map((tag, index) => {
                    if (editInputIndex === index) {
                        return (
                            <Input
                                ref={this.saveEditInputRef}
                                key={tag}
                                size="small"
                                className="tag-input"
                                value={editInputValue}
                                onChange={this.handleEditInputChange}
                                onBlur={this.handleEditInputConfirm}
                                onPressEnter={this.handleEditInputConfirm}
                            />
                        );
                    }

                    const isLongTag = tag.length > 20;

                    const tagElem = (
                        <Tag
                            className="edit-tag"
                            key={tag}
                            closable={index !== 0}
                            onClose={() => this.handleClose(tag)}
                        >
                            <span
                                onDoubleClick={(e) => {
                                    if (index !== 0) {
                                        this.setState(
                                            {
                                                editInputIndex: index,
                                                editInputValue: tag,
                                            },
                                            () => {
                                                this.editInput.focus();
                                            }
                                        );
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> Nueva etiqueta
                    </Tag>
                )}
            </>
        );
    }
}
export default ModalForm;
