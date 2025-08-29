// AI Coordinator Pro - React Native Mobile App
// Professional mobile interface for AI team coordination

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  Switch,
  Vibration
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const AICoordinatorMobile = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [workflowPresets, setWorkflowPresets] = useState([]);
  const [agents, setAgents] = useState([
    { id: 'github-copilot', name: 'GitHub Copilot', status: 'active' },
    { id: 'gemini-cli', name: 'Gemini CLI', status: 'offline' },
    { id: 'qwen-cli', name: 'Qwen CLI', status: 'offline' }
  ]);
  const [socket, setSocket] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', agent: '', urgent: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
    setupPushNotifications();
  }, []);

  const initializeApp = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      connectWebSocket();
      loadData();
    }
  };

  const setupPushNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {
        if (notification.userInteraction) {
          // User tapped notification
          handleNotificationTap(notification.data);
        }
        Vibration.vibrate([0, 250, 250, 250]);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const connectWebSocket = () => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('new_approval_request', (request) => {
      setApprovalRequests(prev => [request, ...prev]);
      showPushNotification(request);
    });

    newSocket.on('request_approved', (data) => {
      setApprovalRequests(prev => 
        prev.map(req => req.id === data.request_id 
          ? { ...req, status: 'approved' } 
          : req
        )
      );
    });
  };

  const showPushNotification = (request) => {
    PushNotification.localNotification({
      title: `AI Coordination: ${request.title}`,
      message: request.description,
      priority: request.priority === 'critical' ? 'max' : 'high',
      vibrate: true,
      playSound: true,
      data: { request_id: request.id }
    });
  };

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [requestsRes, presetsRes] = await Promise.all([
        fetch('http://localhost:5001/api/approval-requests'),
        fetch('http://localhost:5001/api/workflow-presets')
      ]);
      
      setApprovalRequests(await requestsRes.json());
      setWorkflowPresets(Object.values(await presetsRes.json()));
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApproval = async (requestId, approved) => {
    try {
      await fetch(`http://localhost:5001/api/approval-requests/${requestId}/${approved ? 'approve' : 'reject'}`, {
        method: 'POST'
      });
      
      Vibration.vibrate(100);
      Alert.alert(
        'Success', 
        `Request ${approved ? 'approved' : 'rejected'} successfully`
      );
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to process request');
    }
  };

  const startWorkflow = async (presetName) => {
    try {
      await fetch(`http://localhost:5001/api/workflows/${presetName}/start`, {
        method: 'POST'
      });
      Alert.alert('Success', 'Workflow started successfully');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to start workflow');
    }
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.agent) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await fetch(`http://localhost:5001/api/agents/${newTask.agent}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      
      Alert.alert('Success', 'Task created and sent for approval');
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', agent: '', urgent: false });
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#FF4757',
      high: '#FFA726',
      medium: '#42A5F5',
      low: '#66BB6A'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#00FF88',
      busy: '#FFA726',
      offline: '#666666'
    };
    return colors[status] || colors.offline;
  };

  const pendingRequests = approvalRequests.filter(r => r.status === 'pending');

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0f0f0f" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Coordinator Pro</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.badgeText}>{pendingRequests.length}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.createTaskButton}
            onPress={() => setShowTaskModal(true)}
          >
            <Text style={styles.createTaskText}>+ Create Task</Text>
          </TouchableOpacity>
        </View>

        {/* Workflow Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workflow Presets</Text>
          {workflowPresets.map(preset => (
            <TouchableOpacity 
              key={preset.name}
              style={styles.presetCard}
              onPress={() => startWorkflow(preset.name)}
            >
              <Text style={styles.presetName}>{preset.name}</Text>
              <Text style={styles.presetDescription}>{preset.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Approval Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pending Approvals ({pendingRequests.length})
          </Text>
          {pendingRequests.length === 0 ? (
            <Text style={styles.emptyText}>No pending approvals</Text>
          ) : (
            pendingRequests.map(request => (
              <View key={request.id} style={[
                styles.requestCard,
                { borderLeftColor: getPriorityColor(request.priority) }
              ]}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestTitle}>{request.title}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(request.priority) }
                  ]}>
                    <Text style={styles.priorityText}>{request.priority}</Text>
                  </View>
                </View>
                <Text style={styles.requestDescription}>{request.description}</Text>
                <Text style={styles.requestAgent}>Agent: {request.agent}</Text>
                
                <View style={styles.requestActions}>
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleApproval(request.id, true)}
                  >
                    <Text style={styles.approveText}>✓ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rejectButton}
                    onPress={() => handleApproval(request.id, false)}
                  >
                    <Text style={styles.rejectText}>✗ Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Agent Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Agents</Text>
          {agents.map(agent => (
            <View key={agent.id} style={styles.agentCard}>
              <Text style={styles.agentName}>{agent.name}</Text>
              <View style={[
                styles.agentStatus,
                { backgroundColor: getStatusColor(agent.status) }
              ]}>
                <Text style={styles.agentStatusText}>{agent.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Create Task Modal */}
      <Modal
        visible={showTaskModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Task</Text>
            <TouchableOpacity onPress={() => setShowTaskModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Task Title *</Text>
            <TextInput
              style={styles.textInput}
              value={newTask.title}
              onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
              placeholder="Enter task title"
              placeholderTextColor="#666"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newTask.description}
              onChangeText={(text) => setNewTask(prev => ({ ...prev, description: text }))}
              placeholder="Enter task description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Agent *</Text>
            <View style={styles.agentSelector}>
              {agents.map(agent => (
                <TouchableOpacity
                  key={agent.id}
                  style={[
                    styles.agentOption,
                    newTask.agent === agent.id && styles.agentOptionSelected
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, agent: agent.id }))}
                >
                  <Text style={[
                    styles.agentOptionText,
                    newTask.agent === agent.id && styles.agentOptionTextSelected
                  ]}>
                    {agent.name}
                  </Text>   
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.urgentContainer}>
              <Text style={styles.inputLabel}>Urgent Task</Text>
              <Switch
                value={newTask.urgent}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, urgent: value }))}
                trackColor={{ false: "#333", true: "#00d4ff" }}
                thumbColor={newTask.urgent ? "#ffffff" : "#666"}
              />
            </View>

            <TouchableOpacity style={styles.createButton} onPress={createTask}>
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00d4ff',
  },
  headerBadge: {
    backgroundColor: '#ff4757',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  createTaskButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  createTaskText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  presetCard: {
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 5,
  },
  presetDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  requestCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  requestDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  requestAgent: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  approveButton: {
    backgroundColor: '#00ff88',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ff4757',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  approveText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  agentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  agentStatus: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  agentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  agentSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  agentOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  agentOptionSelected: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  agentOptionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  agentOptionTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  urgentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  createButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AICoordinatorMobile;